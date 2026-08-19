import phases from './phases'
import missions from './missions'

export function getPhaseContent(slug: string) {
  return phases[slug]
}

export function getMissionContent(slug: string) {
  return missions[slug]
}
