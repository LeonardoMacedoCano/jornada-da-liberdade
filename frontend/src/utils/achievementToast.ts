import type { TFunction } from 'i18next'
import type { ToastStackItem } from 'lcano-react-ui'
import { Phase } from '../types'

export function buildPhaseAchievementToast(phase: Pick<Phase, 'achievementIcon' | 'achievementName' | 'title'>, t: TFunction): ToastStackItem {
  return {
    icon: phase.achievementIcon,
    eyebrow: t('achievement.unlocked'),
    title: phase.achievementName,
    description: phase.title,
  }
}
