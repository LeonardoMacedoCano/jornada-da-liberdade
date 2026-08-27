import { Response } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth'
import { MAX_PHASE_ID } from '../lib/constants'
import { getMinimumWage } from '../lib/appConfig'
import { ErrorCode } from '../lib/errors'
import { advancePhaseIfComplete } from '../services/progressionService'

export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true, name: true, email: true, username: true,
      avatarType: true, sharePublicProfile: true, showFinancialValues: true, createdAt: true,
      progress: true,
    },
  })
  if (!user) { res.status(404).json({ error: ErrorCode.USER_NOT_FOUND }); return }
  res.json(user)
}

async function autoCompleteMissions(userId: string, progress: {
  investedAmount: Prisma.Decimal,
  monthlyPassiveIncome: Prisma.Decimal,
  monthlyContribution: Prisma.Decimal,
  annualReturnRate: Prisma.Decimal,
  currentPhaseId: number,
}): Promise<{ newlyCompleted: number[], phaseAdvanced: boolean, newPhaseId: number }> {
  const invested = parseFloat(progress.investedAmount.toString())
  const passiveIncome = parseFloat(progress.monthlyPassiveIncome.toString())
  const contribution = parseFloat(progress.monthlyContribution.toString())
  const annualRate = parseFloat(progress.annualReturnRate.toString())
  const monthlyReturn = invested * (annualRate / 100 / 12)
  const { value: minimumWage } = getMinimumWage()

  const maxPhase = Math.min(progress.currentPhaseId + 1, MAX_PHASE_ID)
  const missions = await prisma.mission.findMany({
    where: { phaseId: { lte: maxPhase }, missionType: { in: ['portfolio_value', 'passive_income_sm', 'crossover'] } },
  })

  const alreadyCompleted = await prisma.userMissionProgress.findMany({
    where: { userId, isCompleted: true },
  })
  const completedMissionIds = new Set(alreadyCompleted.map(p => p.missionId))

  const newlyCompleted: number[] = []

  for (const mission of missions) {
    if (completedMissionIds.has(mission.id)) continue

    let shouldComplete = false
    if (mission.missionType === 'portfolio_value' && mission.targetValue !== null) {
      shouldComplete = invested >= parseFloat(mission.targetValue.toString())
    } else if (mission.missionType === 'passive_income_sm' && mission.targetSmMultiple !== null) {
      const threshold = parseFloat(mission.targetSmMultiple.toString()) * minimumWage
      shouldComplete = passiveIncome >= threshold
    } else if (mission.missionType === 'crossover') {
      shouldComplete = contribution > 0 && monthlyReturn >= contribution
    }

    if (shouldComplete) {
      await prisma.userMissionProgress.upsert({
        where: { userId_missionId: { userId, missionId: mission.id } },
        update: { isCompleted: true, completedAt: new Date() },
        create: { userId, missionId: mission.id, isCompleted: true, completedAt: new Date() },
      })
      newlyCompleted.push(mission.id)
    }
  }

  const { phaseAdvanced, newPhaseId } = await advancePhaseIfComplete(userId, progress.currentPhaseId)

  return { newlyCompleted, phaseAdvanced, newPhaseId }
}

export async function updateProgress(req: AuthRequest, res: Response): Promise<void> {
  const { investedAmount, monthlyPassiveIncome, monthlyContribution, annualReturnRate } = req.body

  for (const [key, val] of Object.entries({ investedAmount, monthlyPassiveIncome, monthlyContribution })) {
    if (val !== undefined && (isNaN(Number(val)) || Number(val) < 0)) {
      res.status(400).json({ error: ErrorCode.INVALID_NON_NEGATIVE_FIELD, field: key })
      return
    }
  }
  if (annualReturnRate !== undefined) {
    const rate = Number(annualReturnRate)
    if (isNaN(rate) || rate < 0 || rate > 100) {
      res.status(400).json({ error: ErrorCode.INVALID_RETURN_RATE })
      return
    }
  }

  const updated = await prisma.userProgress.upsert({
    where: { userId: req.userId! },
    update: {
      ...(investedAmount !== undefined && { investedAmount: new Prisma.Decimal(investedAmount) }),
      ...(monthlyPassiveIncome !== undefined && { monthlyPassiveIncome: new Prisma.Decimal(monthlyPassiveIncome) }),
      ...(monthlyContribution !== undefined && { monthlyContribution: new Prisma.Decimal(monthlyContribution) }),
      ...(annualReturnRate !== undefined && { annualReturnRate: new Prisma.Decimal(annualReturnRate) }),
    },
    create: {
      userId: req.userId!,
      investedAmount: new Prisma.Decimal(investedAmount ?? 0),
      monthlyPassiveIncome: new Prisma.Decimal(monthlyPassiveIncome ?? 0),
      monthlyContribution: new Prisma.Decimal(monthlyContribution ?? 0),
      annualReturnRate: new Prisma.Decimal(annualReturnRate ?? 11),
    },
  })

  const result = await autoCompleteMissions(req.userId!, updated)

  const freshProgress = await prisma.userProgress.findUnique({ where: { userId: req.userId! } })
  res.json({ progress: freshProgress ?? updated, ...result })
}

export async function updateSettings(req: AuthRequest, res: Response): Promise<void> {
  const { name, username, sharePublicProfile, showFinancialValues } = req.body

  if (name !== undefined && !name.trim()) {
    res.status(400).json({ error: ErrorCode.NAME_CANNOT_BE_EMPTY })
    return
  }

  if (username !== undefined) {
    if (!username || !/^[a-z0-9-]+$/.test(username)) {
      res.status(400).json({ error: ErrorCode.INVALID_USERNAME_FORMAT })
      return
    }
    const existing = await prisma.user.findFirst({ where: { username, NOT: { id: req.userId } } })
    if (existing) { res.status(409).json({ error: ErrorCode.USERNAME_ALREADY_IN_USE }); return }
  }

  const user = await prisma.user.update({
    where: { id: req.userId },
    data: {
      ...(name !== undefined && { name }),
      ...(username !== undefined && { username }),
      ...(sharePublicProfile !== undefined && { sharePublicProfile }),
      ...(showFinancialValues !== undefined && { showFinancialValues }),
    },
    select: { id: true, name: true, email: true, username: true, sharePublicProfile: true, showFinancialValues: true },
  })
  res.json(user)
}
