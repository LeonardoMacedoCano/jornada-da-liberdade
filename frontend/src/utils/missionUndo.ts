import { Mission, Phase } from '../types'
import { getPhaseContent } from '../i18n/content'

const AUTOMATIC_MISSION_TYPES: Mission['missionType'][] = ['portfolio_value', 'passive_income_sm', 'crossover']

export function buildUndoConfirmMessage(mission: Mission, owningPhase?: Phase): { title: string; description: string } {
  const isAutomatic = AUTOMATIC_MISSION_TYPES.includes(mission.missionType)
  const willRollbackPhase = mission.isRequiredForPhase && owningPhase?.status === 'completed'

  if (willRollbackPhase) {
    const phaseName = owningPhase ? getPhaseContent(owningPhase.slug).name : ''
    return {
      title: 'Desfazer missão e reabrir a fase?',
      description:
        `Esta missão é obrigatória e pertence à fase "${phaseName}", que você já concluiu. ` +
        `Ao confirmar, sua fase atual volta para "${phaseName}" e o histórico de conquistas das fases seguintes é removido, até você completar as missões pendentes de novo.` +
        (isAutomatic
          ? ' Se o valor financeiro foi preenchido errado, corrija-o antes de continuar — senão esta missão pode ser concluída automaticamente de novo na próxima atualização.'
          : ''),
    }
  }

  return {
    title: 'Desfazer esta missão?',
    description:
      'Esta missão volta a ficar pendente. Você pode completá-la de novo quando quiser.' +
      (isAutomatic
        ? ' Se os dados financeiros ainda atingem a meta, ela pode ser completada automaticamente de novo na próxima atualização.'
        : ''),
  }
}
