import { describe, it, expect } from 'vitest'
import { buildUndoConfirmMessage } from './missionUndo'
import { Mission, Phase } from '../types'

function buildMission(overrides: Partial<Mission>): Mission {
  return {
    id: 1,
    phaseId: 0,
    slug: 'test-mission',
    missionType: 'behavioral',
    targetValue: null,
    targetSmMultiple: null,
    requiredDurationDays: null,
    isRequiredForPhase: true,
    orderIndex: 1,
    isCompleted: true,
    completedAt: '2026-01-01T00:00:00.000Z',
    startedAt: null,
    ...overrides,
  }
}

function buildPhase(overrides: Partial<Phase>): Phase {
  return {
    id: 0,
    slug: 'tutorial',
    orderIndex: 0,
    achievementIcon: '👁️',
    color: 'gray',
    missions: [],
    status: 'active',
    completedAt: null,
    progressPercent: 0,
    ...overrides,
  }
}

describe('buildUndoConfirmMessage', () => {
  it('mensagem simples quando a fase ainda não foi concluída', () => {
    const mission = buildMission({ missionType: 'behavioral' })
    const phase = buildPhase({ status: 'active' })

    const { title, description } = buildUndoConfirmMessage(mission, phase)

    expect(title).toBe('Desfazer esta missão?')
    expect(description).not.toContain('reabrir')
  })

  it('avisa que a missão pode ser completada de novo automaticamente quando é de tipo automático', () => {
    const mission = buildMission({ missionType: 'portfolio_value' })
    const phase = buildPhase({ status: 'active' })

    const { description } = buildUndoConfirmMessage(mission, phase)

    expect(description).toContain('completada automaticamente de novo')
  })

  it('não avisa sobre reconclusão automática para missões manuais', () => {
    const mission = buildMission({ missionType: 'behavioral' })
    const phase = buildPhase({ status: 'active' })

    const { description } = buildUndoConfirmMessage(mission, phase)

    expect(description).not.toContain('completada automaticamente de novo')
  })

  it('avisa sobre reabertura de fase quando a missão obrigatória pertence a uma fase já concluída', () => {
    const mission = buildMission({ missionType: 'behavioral', isRequiredForPhase: true, phaseId: 0 })
    const phase = buildPhase({ slug: 'tutorial', status: 'completed' })

    const { title, description } = buildUndoConfirmMessage(mission, phase)

    expect(title).toBe('Desfazer missão e reabrir a fase?')
    expect(description).toContain('Tutorial')
  })

  it('não avisa sobre reabertura quando a missão não é obrigatória, mesmo em fase concluída', () => {
    const mission = buildMission({ isRequiredForPhase: false })
    const phase = buildPhase({ status: 'completed' })

    const { title } = buildUndoConfirmMessage(mission, phase)

    expect(title).toBe('Desfazer esta missão?')
  })

  it('funciona sem a fase informada (mensagem simples)', () => {
    const mission = buildMission({})

    const { title } = buildUndoConfirmMessage(mission, undefined)

    expect(title).toBe('Desfazer esta missão?')
  })
})
