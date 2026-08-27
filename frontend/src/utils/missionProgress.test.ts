import { describe, it, expect } from 'vitest'
import { computeMissionProgressPercent, MissionFinancials } from './missionProgress'
import { Mission } from '../types'

const baseFinancials: MissionFinancials = {
  investedAmount: 0,
  monthlyContribution: 0,
  monthlyPassiveIncome: 0,
  annualReturnRate: 11,
}

function buildMission(overrides: Partial<Mission>): Mission {
  return {
    id: 1,
    phaseId: 2,
    slug: 'test-mission',
    missionType: 'portfolio_value',
    targetValue: null,
    targetSmMultiple: null,
    requiredDurationDays: null,
    isRequiredForPhase: true,
    orderIndex: 1,
    isCompleted: false,
    completedAt: null,
    startedAt: null,
    ...overrides,
  }
}

describe('computeMissionProgressPercent', () => {
  it('retorna null quando a missão já está completa', () => {
    const mission = buildMission({ isCompleted: true, targetValue: '1000' })
    const result = computeMissionProgressPercent(mission, { ...baseFinancials, investedAmount: 500 }, 1621)
    expect(result).toBeNull()
  })

  it('calcula percentual para portfolio_value proporcional ao investido', () => {
    const mission = buildMission({ missionType: 'portfolio_value', targetValue: '1000' })
    const result = computeMissionProgressPercent(mission, { ...baseFinancials, investedAmount: 250 }, 1621)
    expect(result).toBe(25)
  })

  it('nunca chega a 100% antes de a missão ser marcada como completa', () => {
    const mission = buildMission({ missionType: 'portfolio_value', targetValue: '1000' })
    const result = computeMissionProgressPercent(mission, { ...baseFinancials, investedAmount: 5000 }, 1621)
    expect(result).toBe(99)
  })

  it('retorna null quando portfolio_value não tem targetValue', () => {
    const mission = buildMission({ missionType: 'portfolio_value', targetValue: null })
    const result = computeMissionProgressPercent(mission, { ...baseFinancials, investedAmount: 500 }, 1621)
    expect(result).toBeNull()
  })

  it('calcula percentual para passive_income_sm em função do salário mínimo', () => {
    const mission = buildMission({ missionType: 'passive_income_sm', targetSmMultiple: '2.0' })
    const minimumWage = 1000
    const result = computeMissionProgressPercent(mission, { ...baseFinancials, monthlyPassiveIncome: 1000 }, minimumWage)
    expect(result).toBe(50)
  })

  it('retorna null para crossover sem aporte mensal', () => {
    const mission = buildMission({ missionType: 'crossover' })
    const result = computeMissionProgressPercent(mission, { ...baseFinancials, monthlyContribution: 0 }, 1621)
    expect(result).toBeNull()
  })

  it('calcula percentual de crossover a partir do retorno mensal projetado', () => {
    const mission = buildMission({ missionType: 'crossover' })
    const financials: MissionFinancials = {
      investedAmount: 100000,
      monthlyContribution: 917,
      monthlyPassiveIncome: 0,
      annualReturnRate: 11,
    }
    // retorno mensal = 100000 * (11 / 100 / 12) ≈ 916.67
    const result = computeMissionProgressPercent(mission, financials, 1621)
    expect(result).toBe(99)
  })

  it('retorna null para tipos de missão manuais (behavioral/habit)', () => {
    const mission = buildMission({ missionType: 'behavioral' })
    const result = computeMissionProgressPercent(mission, baseFinancials, 1621)
    expect(result).toBeNull()
  })
})
