import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth'
import { ErrorCode } from '../lib/errors'

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

export async function getAllPhases(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!
  const userProgress = await prisma.userProgress.findUnique({ where: { userId } })
  const currentPhaseId = userProgress?.currentPhaseId ?? 0

  const phases = await prisma.phase.findMany({ orderBy: { orderIndex: 'asc' } })
  const missions = await prisma.mission.findMany({ orderBy: { orderIndex: 'asc' } })
  const missionProgresses = await prisma.userMissionProgress.findMany({ where: { userId } })
  const phaseHistory = await prisma.userPhaseHistory.findMany({ where: { userId } })

  const progressMap = new Map(missionProgresses.map(p => [p.missionId, p]))

  const result = phases.map(phase => {
    const phaseMissions = missions
      .filter(m => m.phaseId === phase.id)
      .map(mission => serializeMission(mission, progressMap.get(mission.id)))

    const required = phaseMissions.filter(m => m.isRequiredForPhase)
    const completedRequired = required.filter(m => m.isCompleted).length
    const historyEntry = phaseHistory.find(h => h.phaseId === phase.id)

    return {
      ...phase,
      missions: phaseMissions,
      status: phase.id < currentPhaseId ? 'completed' : phase.id === currentPhaseId ? 'active' : 'locked',
      completedAt: historyEntry?.completedAt ?? null,
      progressPercent: required.length > 0 ? Math.round((completedRequired / required.length) * 100) : 0,
    }
  })

  res.json(result)
}

export async function getCurrentPhase(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!
  const userProgress = await prisma.userProgress.findUnique({ where: { userId } })
  const currentPhaseId = userProgress?.currentPhaseId ?? 0

  const phase = await prisma.phase.findUnique({ where: { id: currentPhaseId } })
  if (!phase) { res.status(404).json({ error: ErrorCode.PHASE_NOT_FOUND }); return }

  const missions = await prisma.mission.findMany({ where: { phaseId: currentPhaseId }, orderBy: { orderIndex: 'asc' } })
  const missionProgresses = await prisma.userMissionProgress.findMany({
    where: { userId, missionId: { in: missions.map(m => m.id) } },
  })
  const progressMap = new Map(missionProgresses.map(p => [p.missionId, p]))

  const missionsWithProgress = missions.map(mission => serializeMission(mission, progressMap.get(mission.id)))

  const required = missionsWithProgress.filter(m => m.isRequiredForPhase)
  const completedRequired = required.filter(m => m.isCompleted).length

  res.json({
    ...phase,
    missions: missionsWithProgress,
    progressPercent: required.length > 0 ? Math.round((completedRequired / required.length) * 100) : 0,
  })
}
