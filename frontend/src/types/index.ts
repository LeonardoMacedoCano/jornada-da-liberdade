export interface User {
  id: string
  name: string
  email: string
  username: string
  avatarType: string
  sharePublicProfile: boolean
  showFinancialValues: boolean
  createdAt: string
}

export interface UserProgress {
  id: string
  userId: string
  currentPhaseId: number
  investedAmount: string
  monthlyPassiveIncome: string
  monthlyContribution: string
  annualReturnRate: string
  updatedAt: string
}

export interface Mission {
  id: number
  phaseId: number
  slug: string
  missionType: 'portfolio_value' | 'passive_income_sm' | 'crossover' | 'behavioral' | 'habit'
  targetValue: string | null
  targetSmMultiple: string | null
  requiredDurationDays: number | null
  isRequiredForPhase: boolean
  orderIndex: number
  isCompleted: boolean
  completedAt: string | null
  startedAt: string | null
}

export interface Phase {
  id: number
  slug: string
  orderIndex: number
  achievementIcon: string
  color: string
  missions: Mission[]
  status: 'completed' | 'active' | 'locked'
  completedAt: string | null
  progressPercent: number
}

export interface Achievement {
  phaseId: number
  phaseSlug: string
  achievementIcon: string
  color: string
  completedAt: string
}

export interface PublicProfile {
  name: string
  username: string
  avatarType: string
  createdAt: string
  currentPhase: {
    id: number
    slug: string
    achievementIcon: string
    color: string
  } | null
  progressPercent: number
  achievements: Achievement[]
  financialData: {
    investedAmount: string
    monthlyPassiveIncome: string
  } | null
}

export const PHASE_HEX_COLORS: Record<string, string> = {
  gray:   '#6b7280',
  red:    '#ef4444',
  green:  '#22c55e',
  blue:   '#3b82f6',
  teal:   '#14b8a6',
  purple: '#a855f7',
  orange: '#f97316',
  yellow: '#eab308',
  amber:  '#d97706',
  rose:   '#f43f5e',
}

export const MISSION_TYPE_ICONS: Record<string, string> = {
  portfolio_value:  '💰',
  passive_income_sm: '📈',
  crossover:        '✨',
  behavioral:       '🧠',
  habit:            '🔄',
}
