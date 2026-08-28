import { prisma } from '../lib/prisma'
import { MAX_PHASE_ID } from '../lib/constants'

export interface PhaseAdvanceResult {
  phaseAdvanced: boolean
  newPhaseId: number
}

async function advanceSinglePhase(userId: string, phaseId: number): Promise<boolean> {
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

// Loops through consecutive phases in one call, since a single financial
// update can satisfy several phases' requirements at once.
export async function advancePhaseIfComplete(userId: string, phaseId: number): Promise<PhaseAdvanceResult> {
  let currentPhaseId = phaseId
  let phaseAdvanced = false

  while (await advanceSinglePhase(userId, currentPhaseId)) {
    currentPhaseId += 1
    phaseAdvanced = true
  }

  return { phaseAdvanced, newPhaseId: currentPhaseId }
}
