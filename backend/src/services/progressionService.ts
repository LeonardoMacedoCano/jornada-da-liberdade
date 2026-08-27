import { prisma } from '../lib/prisma'
import { MAX_PHASE_ID } from '../lib/constants'

export interface PhaseAdvanceResult {
  phaseAdvanced: boolean
  newPhaseId: number
}

// Regra central do jogo: uma fase avança quando todas as suas missões
// obrigatórias estão concluídas. Chamada tanto após atualização de dados
// financeiros quanto após conclusão manual de missão.
export async function advancePhaseIfComplete(userId: string, phaseId: number): Promise<PhaseAdvanceResult> {
  if (phaseId >= MAX_PHASE_ID) return { phaseAdvanced: false, newPhaseId: phaseId }

  const requiredMissions = await prisma.mission.findMany({
    where: { phaseId, isRequiredForPhase: true },
  })
  if (requiredMissions.length === 0) return { phaseAdvanced: false, newPhaseId: phaseId }

  const completedCount = await prisma.userMissionProgress.count({
    where: { userId, missionId: { in: requiredMissions.map(m => m.id) }, isCompleted: true },
  })
  if (completedCount < requiredMissions.length) return { phaseAdvanced: false, newPhaseId: phaseId }

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
    return { phaseAdvanced: true, newPhaseId: phaseId + 1 }
  } catch (e: any) {
    if (e.code === 'P2002') return { phaseAdvanced: false, newPhaseId: phaseId }
    throw e
  }
}
