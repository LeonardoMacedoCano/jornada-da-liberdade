import phasesEn from './phases.en'
import phasesPtBR from './phases.pt-BR'
import missionsEn from './missions.en'
import missionsPtBR from './missions.pt-BR'
import type { PhaseContent } from './phases.en'
import type { MissionContent } from './missions.en'

export function getPhaseContent(slug: string, language: string): PhaseContent {
  const map = language === 'en' ? phasesEn : phasesPtBR
  return map[slug] ?? phasesPtBR[slug]
}

export function getMissionContent(slug: string, language: string): MissionContent {
  const map = language === 'en' ? missionsEn : missionsPtBR
  return map[slug] ?? missionsPtBR[slug]
}
