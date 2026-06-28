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
  title: string
  description: string
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
  name: string
  title: string
  subtitle: string
  description: string
  flavorText: string
  orderIndex: number
  achievementName: string
  achievementIcon: string
  color: string
  missions: Mission[]
  status: 'completed' | 'active' | 'locked'
  completedAt: string | null
  progressPercent: number
}

export interface Achievement {
  phaseId: number
  phaseName: string
  achievementName: string
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
    name: string
    title: string
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

export const PHASE_COLORS: Record<string, string> = {
  gray: 'text-gray-400 border-gray-400 bg-gray-400',
  green: 'text-green-400 border-green-400 bg-green-400',
  blue: 'text-blue-400 border-blue-400 bg-blue-400',
  teal: 'text-teal-400 border-teal-400 bg-teal-400',
  purple: 'text-purple-400 border-purple-400 bg-purple-400',
  orange: 'text-orange-400 border-orange-400 bg-orange-400',
  yellow: 'text-yellow-400 border-yellow-400 bg-yellow-400',
  amber: 'text-amber-400 border-amber-400 bg-amber-400',
  red: 'text-red-400 border-red-400 bg-red-400',
}

export const PHASE_BORDER_COLORS: Record<string, string> = {
  gray: 'border-l-gray-400',
  green: 'border-l-green-400',
  blue: 'border-l-blue-400',
  teal: 'border-l-teal-400',
  purple: 'border-l-purple-400',
  orange: 'border-l-orange-400',
  yellow: 'border-l-yellow-400',
  amber: 'border-l-amber-400',
  red: 'border-l-red-400',
}

export const PHASE_TEXT_COLORS: Record<string, string> = {
  gray: 'text-gray-400',
  green: 'text-green-400',
  blue: 'text-blue-400',
  teal: 'text-teal-400',
  purple: 'text-violet-400',
  orange: 'text-orange-400',
  yellow: 'text-yellow-400',
  amber: 'text-amber-400',
  red: 'text-red-400',
}

export const MISSION_TYPE_LABELS: Record<string, string> = {
  portfolio_value: 'Patrimônio',
  passive_income_sm: 'Renda Passiva (SM)',
  crossover: 'Ponto de Cruzamento',
  behavioral: 'Comportamental',
  habit: 'Hábito',
}

export const MISSION_TYPE_ICONS: Record<string, string> = {
  portfolio_value: '💰',
  passive_income_sm: '📈',
  crossover: '✨',
  behavioral: '🧠',
  habit: '🔄',
}
