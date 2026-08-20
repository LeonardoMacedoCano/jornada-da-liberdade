import type { ToastStackItem } from 'lcano-react-ui'
import { Phase } from '../types'
import { getPhaseContent } from '../i18n/content'
import strings from '../i18n/strings'

export function buildPhaseAchievementToast(phase: Pick<Phase, 'slug' | 'achievementIcon'>): ToastStackItem {
  const content = getPhaseContent(phase.slug)
  return {
    icon: phase.achievementIcon,
    eyebrow: strings.achievement.unlocked,
    title: content.achievementName,
    description: content.title,
  }
}
