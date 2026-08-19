import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { ErrorCode } from '../lib/errors'

export async function getPublicProfile(req: Request, res: Response): Promise<void> {
  const { username } = req.params

  const user = await prisma.user.findUnique({ where: { username } })
  if (!user || !user.sharePublicProfile) {
    res.status(404).json({ error: ErrorCode.PROFILE_NOT_FOUND_OR_PRIVATE })
    return
  }

  const progress = await prisma.userProgress.findUnique({ where: { userId: user.id } })
  const currentPhaseId = progress?.currentPhaseId ?? 0

  const currentPhase = await prisma.phase.findUnique({ where: { id: currentPhaseId } })
  const phaseHistory = await prisma.userPhaseHistory.findMany({
    where: { userId: user.id },
    include: { phase: true },
    orderBy: { completedAt: 'asc' },
  })

  const missions = await prisma.mission.findMany({
    where: { phaseId: currentPhaseId, isRequiredForPhase: true },
  })
  const missionProgresses = await prisma.userMissionProgress.findMany({
    where: { userId: user.id, missionId: { in: missions.map(m => m.id) } },
  })
  const completedRequired = missionProgresses.filter(p => p.isCompleted).length
  const progressPercent = missions.length > 0 ? Math.round((completedRequired / missions.length) * 100) : 0

  const achievements = phaseHistory.map(h => ({
    phaseId: h.phaseId,
    phaseSlug: h.phase.slug,
    achievementIcon: h.phase.achievementIcon,
    color: h.phase.color,
    completedAt: h.completedAt,
  }))

  res.json({
    name: user.name,
    username: user.username,
    avatarType: user.avatarType,
    createdAt: user.createdAt,
    currentPhase: currentPhase ? {
      id: currentPhase.id,
      slug: currentPhase.slug,
      achievementIcon: currentPhase.achievementIcon,
      color: currentPhase.color,
    } : null,
    progressPercent,
    achievements,
    financialData: user.showFinancialValues && progress ? {
      investedAmount: progress.investedAmount.toString(),
      monthlyPassiveIncome: progress.monthlyPassiveIncome.toString(),
    } : null,
  })
}
