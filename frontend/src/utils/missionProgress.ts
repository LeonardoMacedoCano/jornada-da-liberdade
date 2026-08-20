import { Mission } from '../types'

export interface MissionFinancials {
  investedAmount: number
  monthlyContribution: number
  monthlyPassiveIncome: number
  annualReturnRate: number
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0
  return Math.min(Math.round(value), 99)
}

export function computeMissionProgressPercent(
  mission: Mission,
  financials: MissionFinancials,
  minimumWage: number
): number | null {
  if (mission.isCompleted) return null

  if (mission.missionType === 'portfolio_value' && mission.targetValue) {
    const target = parseFloat(mission.targetValue)
    if (target <= 0) return null
    return clampPercent((financials.investedAmount / target) * 100)
  }

  if (mission.missionType === 'passive_income_sm' && mission.targetSmMultiple) {
    const target = parseFloat(mission.targetSmMultiple) * minimumWage
    if (target <= 0) return null
    return clampPercent((financials.monthlyPassiveIncome / target) * 100)
  }

  if (mission.missionType === 'crossover') {
    if (financials.monthlyContribution <= 0) return null
    const monthlyReturn = financials.investedAmount * (financials.annualReturnRate / 100 / 12)
    return clampPercent((monthlyReturn / financials.monthlyContribution) * 100)
  }

  return null
}
