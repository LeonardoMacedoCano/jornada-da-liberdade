import { describe, it, expect, vi, beforeEach } from 'vitest'

interface FakeMission {
  id: number
  phaseId: number
  isRequiredForPhase: boolean
}

let missions: FakeMission[]
let completedMissionIds: Set<number>
let userProgress: { currentPhaseId: number; investedAmount: number }
let phaseHistory: number[]

vi.mock('../lib/prisma', () => ({
  prisma: {
    mission: {
      findMany: vi.fn(async ({ where }: any) =>
        missions.filter(m =>
          m.phaseId === where.phaseId &&
          (where.isRequiredForPhase === undefined || m.isRequiredForPhase === where.isRequiredForPhase)
        )
      ),
    },
    userMissionProgress: {
      count: vi.fn(async ({ where }: any) => {
        const ids: number[] = where.missionId.in
        return ids.filter(id => completedMissionIds.has(id)).length
      }),
    },
    userProgress: {
      findUnique: vi.fn(async () => ({ investedAmount: userProgress.investedAmount })),
      update: vi.fn(async ({ data }: any) => {
        userProgress.currentPhaseId = data.currentPhaseId
        return userProgress
      }),
    },
    userPhaseHistory: {
      create: vi.fn(async ({ data }: any) => {
        phaseHistory.push(data.phaseId)
        return data
      }),
    },
    $transaction: vi.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
  },
}))

const { advancePhaseIfComplete } = await import('./progressionService')

describe('advancePhaseIfComplete', () => {
  beforeEach(() => {
    completedMissionIds = new Set()
    phaseHistory = []
    userProgress = { currentPhaseId: 0, investedAmount: 0 }
  })

  it('não avança quando há missão obrigatória pendente', async () => {
    missions = [{ id: 1, phaseId: 0, isRequiredForPhase: true }]

    const result = await advancePhaseIfComplete('user-1', 0)

    expect(result).toEqual({ phaseAdvanced: false, newPhaseId: 0 })
    expect(phaseHistory).toEqual([])
  })

  it('avança uma fase quando todas as missões obrigatórias estão completas', async () => {
    missions = [{ id: 1, phaseId: 0, isRequiredForPhase: true }]
    completedMissionIds.add(1)

    const result = await advancePhaseIfComplete('user-1', 0)

    expect(result).toEqual({ phaseAdvanced: true, newPhaseId: 1 })
    expect(phaseHistory).toEqual([0])
  })

  // Regressão: antes da correção, um único aporte grande só avançava uma
  // fase por chamada, mesmo com as missões de várias fases já satisfeitas.
  it('avança múltiplas fases em sequência numa única chamada', async () => {
    missions = [
      { id: 1, phaseId: 0, isRequiredForPhase: true },
      { id: 2, phaseId: 1, isRequiredForPhase: true },
      { id: 3, phaseId: 2, isRequiredForPhase: true },
    ]
    completedMissionIds.add(1)
    completedMissionIds.add(2)
    completedMissionIds.add(3)

    const result = await advancePhaseIfComplete('user-1', 0)

    expect(result).toEqual({ phaseAdvanced: true, newPhaseId: 3 })
    expect(phaseHistory).toEqual([0, 1, 2])
  })

  it('para na primeira fase intermediária com missão obrigatória pendente', async () => {
    missions = [
      { id: 1, phaseId: 0, isRequiredForPhase: true },
      { id: 2, phaseId: 1, isRequiredForPhase: true },
      { id: 3, phaseId: 2, isRequiredForPhase: true },
    ]
    completedMissionIds.add(1)
    completedMissionIds.add(3) // fase 2 completa, mas fase 1 (intermediária) não

    const result = await advancePhaseIfComplete('user-1', 0)

    expect(result).toEqual({ phaseAdvanced: true, newPhaseId: 1 })
    expect(phaseHistory).toEqual([0])
  })

  it('não avança além da última fase (MAX_PHASE_ID)', async () => {
    missions = [{ id: 1, phaseId: 9, isRequiredForPhase: true }]
    completedMissionIds.add(1)

    const result = await advancePhaseIfComplete('user-1', 9)

    expect(result).toEqual({ phaseAdvanced: false, newPhaseId: 9 })
    expect(phaseHistory).toEqual([])
  })

  it('não avança quando a fase não tem nenhuma missão obrigatória', async () => {
    missions = []

    const result = await advancePhaseIfComplete('user-1', 0)

    expect(result).toEqual({ phaseAdvanced: false, newPhaseId: 0 })
  })
})
