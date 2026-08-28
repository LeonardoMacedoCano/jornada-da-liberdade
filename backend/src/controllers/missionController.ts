import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth'
import { ErrorCode } from '../lib/errors'
import { serializeMission } from '../lib/missionSerializer'
import { advancePhaseIfComplete } from '../services/progressionService'

function parseMissionId(param: string): number | null {
  const id = Number(param)
  return Number.isInteger(id) && id > 0 ? id : null
}

export async function getMissions(req: AuthRequest, res: Response): Promise<void> {
  const rawPhaseId = req.query.phaseId ? Number(req.query.phaseId) : undefined
  const phaseId = rawPhaseId !== undefined && Number.isInteger(rawPhaseId) ? rawPhaseId : undefined
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

export async function completeMission(req: AuthRequest, res: Response): Promise<void> {
  const missionId = parseMissionId(req.params.id)
  if (missionId === null) { res.status(400).json({ error: ErrorCode.INVALID_MISSION_ID }); return }
  const userId = req.userId!

  const mission = await prisma.mission.findUnique({ where: { id: missionId } })
  if (!mission) { res.status(404).json({ error: ErrorCode.MISSION_NOT_FOUND }); return }

  if (!['behavioral', 'habit'].includes(mission.missionType)) {
    res.status(400).json({ error: ErrorCode.ONLY_MANUAL_MISSIONS_CAN_BE_COMPLETED })
    return
  }

  if (mission.missionType === 'habit') {
    const existing = await prisma.userMissionProgress.findUnique({
      where: { userId_missionId: { userId, missionId } },
    })
    if (!existing?.startedAt) {
      res.status(400).json({ error: ErrorCode.START_TRACKING_FIRST })
      return
    }
    const requiredDays = mission.requiredDurationDays ?? 0
    const elapsedDays = Math.floor((Date.now() - existing.startedAt.getTime()) / 86400000)
    if (elapsedDays < requiredDays) {
      res.status(400).json({
        error: ErrorCode.HABIT_DURATION_NOT_MET,
        elapsedDays,
        requiredDays,
        remainingDays: requiredDays - elapsedDays,
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
    phaseAdvanced = (await advancePhaseIfComplete(userId, currentPhaseId)).phaseAdvanced
  }

  res.json({ progress, phaseAdvanced })
}

export async function startMission(req: AuthRequest, res: Response): Promise<void> {
  const missionId = parseMissionId(req.params.id)
  if (missionId === null) { res.status(400).json({ error: ErrorCode.INVALID_MISSION_ID }); return }
  const userId = req.userId!

  const mission = await prisma.mission.findUnique({ where: { id: missionId } })
  if (!mission) { res.status(404).json({ error: ErrorCode.MISSION_NOT_FOUND }); return }

  if (mission.missionType !== 'habit') {
    res.status(400).json({ error: ErrorCode.ONLY_HABIT_MISSIONS_CAN_START })
    return
  }

  const existing = await prisma.userMissionProgress.findUnique({
    where: { userId_missionId: { userId, missionId } },
  })
  if (existing?.startedAt) {
    res.status(409).json({ error: ErrorCode.TRACKING_ALREADY_STARTED, startedAt: existing.startedAt })
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
  const missionId = parseMissionId(req.params.id)
  if (missionId === null) { res.status(400).json({ error: ErrorCode.INVALID_MISSION_ID }); return }
  const userId = req.userId!

  const mission = await prisma.mission.findUnique({ where: { id: missionId } })
  if (!mission) { res.status(404).json({ error: ErrorCode.MISSION_NOT_FOUND }); return }

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
    res.json({ message: 'Mission unmarked', phaseRolledBack: false })
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
      res.json({ message: 'Mission unmarked', phaseRolledBack: true, newPhaseId: mission.phaseId })
      return
    }
  }

  res.json({ message: 'Mission unmarked', phaseRolledBack: false })
}
