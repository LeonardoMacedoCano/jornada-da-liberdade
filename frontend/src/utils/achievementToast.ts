import type { TFunction } from 'i18next'
import type { ToastStackItem } from 'lcano-react-ui'
import { Phase } from '../types'
import { getPhaseContent } from '../i18n/content'

export function buildPhaseAchievementToast(phase: Pick<Phase, 'slug' | 'achievementIcon'>, language: string, t: TFunction): ToastStackItem {
  const content = getPhaseContent(phase.slug, language)
  return {
    icon: phase.achievementIcon,
    eyebrow: t('achievement.unlocked'),
    title: content.achievementName,
    description: content.title,
  }
}
