import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth'
import { MAX_PHASE_ID } from '../lib/constants'

function serializeMission(mission: any, prog?: any) {
  return {
    ...mission,
    targetValue: mission.targetValue?.toString() ?? null,
    targetSmMultiple: mission.targetSmMultiple?.toString() ?? null,
    isCompleted: prog?.isCompleted ?? false,
    completedAt: prog?.completedAt ?? null,
    startedAt: prog?.startedAt ?? null,
  }
}

export async function getMissions(req: AuthRequest, res: Response): Promise<void> {
  const phaseId = req.query.phaseId ? parseInt(req.query.phaseId as string) : undefined
  const userId = req.userId!

  const missions = await prisma.mission.findMany({
    where: phaseId !== undefined ? { phaseId } : {},
    orderBy: [{ phaseId: 'asc' }, { orderIndex: 'asc' }],
  })

  const progresses = await prisma.userMissionProgress.findMany({
    where: { userId, missionId: { in: missions.map(m => m.id) } },
  })
  const progressMap = new Map(progresses.map(p => [p.missionId, p]))

  res.json(missions.map(mission => serializeMission(mission, progressMap.get(mission.id))))
}

async function checkAndAdvancePhase(userId: string, phaseId: number): Promise<boolean> {
  if (phaseId >= MAX_PHASE_ID) return false

  const requiredMissions = await prisma.mission.findMany({
    where: { phaseId, isRequiredForPhase: true },
  })
  if (requiredMissions.length === 0) return false

  const completedCount = await prisma.userMissionProgress.count({
    where: { userId, missionId: { in: requiredMissions.map(m => m.id) }, isCompleted: true },
  })
  if (completedCount < requiredMissions.length) return false

  const userProgress = await prisma.userProgress.findUnique({ where: { userId } })

  try {
    await prisma.$transaction([
      prisma.userPhaseHistory.create({
        data: { userId, phaseId, portfolioValueAtCompletion: userProgress?.investedAmount },
      }),
      prisma.userProgress.update({
        where: { userId },
        data: { currentPhaseId: phaseId + 1 },
      }),
    ])
    return true
  } catch (e: any) {
    if (e.code === 'P2002') return false
    throw e
  }
}

export async function completeMission(req: AuthRequest, res: Response): Promise<void> {
  const missionId = parseInt(req.params.id)
  const userId = req.userId!

  const mission = await prisma.mission.findUnique({ where: { id: missionId } })
  if (!mission) { res.status(404).json({ error: 'Missão não encontrada' }); return }

  if (!['behavioral', 'habit'].includes(mission.missionType)) {
    res.status(400).json({ error: 'Apenas missões comportamentais e de hábito podem ser marcadas manualmente' })
    return
  }

  if (mission.missionType === 'habit') {
    const existing = await prisma.userMissionProgress.findUnique({
      where: { userId_missionId: { userId, missionId } },
    })
    if (!existing?.startedAt) {
      res.status(400).json({ error: 'Inicie o rastreamento antes de concluir esta missão' })
      return
    }
    const requiredDays = mission.requiredDurationDays ?? 0
    const elapsedDays = Math.floor((Date.now() - existing.startedAt.getTime()) / 86400000)
    if (elapsedDays < requiredDays) {
      res.status(400).json({
        error: `Ainda faltam ${requiredDays - elapsedDays} dias para completar esta missão`,
        elapsedDays,
        requiredDays,
      })
      return
    }
  }

  const progress = await prisma.userMissionProgress.upsert({
    where: { userId_missionId: { userId, missionId } },
    update: { isCompleted: true, completedAt: new Date() },
    create: { userId, missionId, isCompleted: true, completedAt: new Date() },
  })

  const userProgress = await prisma.userProgress.findUnique({ where: { userId } })
  const currentPhaseId = userProgress?.currentPhaseId ?? 0
  let phaseAdvanced = false

  if (mission.phaseId === currentPhaseId) {
    phaseAdvanced = await checkAndAdvancePhase(userId, currentPhaseId)
  }

  res.json({ progress, phaseAdvanced })
}

export async function startMission(req: AuthRequest, res: Response): Promise<void> {
  const missionId = parseInt(req.params.id)
  const userId = req.userId!

  const mission = await prisma.mission.findUnique({ where: { id: missionId } })
  if (!mission) { res.status(404).json({ error: 'Missão não encontrada' }); return }

  if (mission.missionType !== 'habit') {
    res.status(400).json({ error: 'Apenas missões de hábito podem ser iniciadas' })
    return
  }

  const existing = await prisma.userMissionProgress.findUnique({
    where: { userId_missionId: { userId, missionId } },
  })
  if (existing?.startedAt) {
    res.status(409).json({ error: 'Rastreamento já iniciado', startedAt: existing.startedAt })
    return
  }

  const updated = await prisma.userMissionProgress.upsert({
    where: { userId_missionId: { userId, missionId } },
    update: { startedAt: new Date() },
    create: { userId, missionId, isCompleted: false, startedAt: new Date() },
  })

  res.json({ startedAt: updated.startedAt })
}

export async function uncompleteMission(req: AuthRequest, res: Response): Promise<void> {
  const missionId = parseInt(req.params.id)
  const userId = req.userId!

  const mission = await prisma.mission.findUnique({ where: { id: missionId } })
  if (!mission) { res.status(404).json({ error: 'Missão não encontrada' }); return }

  if (!['behavioral', 'habit'].includes(mission.missionType)) {
    res.status(400).json({ error: 'Apenas missões comportamentais e de hábito podem ser desmarcadas' })
    return
  }

  await prisma.userMissionProgress.upsert({
    where: { userId_missionId: { userId, missionId } },
    update: {
      isCompleted: false,
      completedAt: null,
      ...(mission.missionType === 'habit' && { startedAt: null }),
    },
    create: { userId, missionId, isCompleted: false },
  })

  if (!mission.isRequiredForPhase) {
    res.json({ message: 'Missão desmarcada', phaseRolledBack: false })
    return
  }

  const userProgress = await prisma.userProgress.findUnique({ where: { userId } })
  const currentPhaseId = userProgress?.currentPhaseId ?? 0

  if (mission.phaseId < currentPhaseId) {
    const requiredMissions = await prisma.mission.findMany({
      where: { phaseId: mission.phaseId, isRequiredForPhase: true },
    })
    const completedCount = await prisma.userMissionProgress.count({
      where: { userId, missionId: { in: requiredMissions.map(m => m.id) }, isCompleted: true },
    })

    if (completedCount < requiredMissions.length) {
      await prisma.$transaction([
        prisma.userPhaseHistory.deleteMany({ where: { userId, phaseId: { gte: mission.phaseId } } }),
        prisma.userProgress.update({ where: { userId }, data: { currentPhaseId: mission.phaseId } }),
      ])
      res.json({ message: 'Missão desmarcada', phaseRolledBack: true, newPhaseId: mission.phaseId })
      return
    }
  }

  res.json({ message: 'Missão desmarcada', phaseRolledBack: false })
}
