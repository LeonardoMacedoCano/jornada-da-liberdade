import styled from 'styled-components'
import { Mission, MISSION_TYPE_ICONS, MISSION_TYPE_LABELS } from '../types'

interface MissionItemProps {
  mission: Mission
  minimumWage?: number
  onToggle?: (id: number, completed: boolean) => void
  onStart?: (id: number) => void
  compact?: boolean
}

const Item = styled.div<{ $completed: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: border-color 0.2s;
  animation: slideIn 0.3s ease-out;

  ${p => p.$completed ? `
    background: rgba(34, 197, 94, 0.05);
    border: 1px solid rgba(34, 197, 94, 0.2);
  ` : `
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    &:hover { border-color: rgba(255, 255, 255, 0.1); }
  `}
`

const CheckButton = styled.button<{ $completed: boolean }>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid ${p => p.$completed ? '#22c55e' : '#4b5563'};
  background: ${p => p.$completed ? '#22c55e' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  margin-top: 2px;

  &:hover {
    border-color: ${p => p.$completed ? '#22c55e' : '#9ca3af'};
  }
`

const CheckDisplay = styled.div<{ $completed: boolean }>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid ${p => p.$completed ? '#22c55e' : '#374151'};
  background: ${p => p.$completed ? '#22c55e' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
`

const Body = styled.div`
  flex: 1;
  min-width: 0;
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

const MissionTitle = styled.span<{ $completed: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${p => p.$completed ? '#6b7280' : p.theme.colors.white};
  text-decoration: ${p => p.$completed ? 'line-through' : 'none'};
`

const BadgeOptional = styled.span`
  font-size: 11px;
  background: rgba(234, 179, 8, 0.2);
  color: #eab308;
  padding: 2px 6px;
  border-radius: 4px;
`

const BadgeType = styled.span`
  font-size: 11px;
  background: rgba(255, 255, 255, 0.05);
  color: ${p => p.theme.colors.gray};
  padding: 2px 6px;
  border-radius: 4px;
`

const Description = styled.p`
  font-size: 12px;
  color: ${p => p.theme.colors.gray};
  margin-top: 4px;
  line-height: 1.5;
`

const Target = styled.p`
  font-size: 12px;
  color: ${p => p.theme.colors.quaternary};
  margin-top: 4px;
  font-weight: 500;
`

const StartButton = styled.button`
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 8px;
  background: rgba(124, 58, 237, 0.2);
  color: ${p => p.theme.colors.quaternary};
  border: 1px solid rgba(124, 58, 237, 0.3);
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: rgba(124, 58, 237, 0.4); }
`

const HabitProgress = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const HabitProgressRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: ${p => p.theme.colors.gray};
`

const HabitTrack = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 999px;
  height: 6px;
  overflow: hidden;
`

const HabitFill = styled.div<{ $width: number }>`
  background: ${p => p.theme.colors.quaternary};
  height: 6px;
  border-radius: 999px;
  width: ${p => p.$width}%;
  transition: width 0.3s;
`

const CompletedDate = styled.p`
  font-size: 12px;
  color: rgba(34, 197, 94, 0.7);
  margin-top: 4px;
`

export default function MissionItem({ mission, minimumWage = 1412, onToggle, onStart, compact = false }: MissionItemProps) {
  const isManual = mission.missionType === 'behavioral' || mission.missionType === 'habit'
  const icon = MISSION_TYPE_ICONS[mission.missionType]
  const label = MISSION_TYPE_LABELS[mission.missionType]

  const elapsedDays = mission.startedAt
    ? Math.floor((Date.now() - new Date(mission.startedAt).getTime()) / 86400000)
    : null
  const requiredDays = mission.requiredDurationDays ?? 0
  const habitCanComplete = mission.missionType === 'habit' && elapsedDays !== null && elapsedDays >= requiredDays

  function formatTarget() {
    if (mission.missionType === 'portfolio_value' && mission.targetValue) {
      return `Meta: R$ ${parseFloat(mission.targetValue).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`
    }
    if (mission.missionType === 'passive_income_sm' && mission.targetSmMultiple) {
      const multiple = parseFloat(mission.targetSmMultiple)
      const value = multiple * minimumWage
      return `Meta: ${multiple}× SM = R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês`
    }
    if (mission.missionType === 'crossover') {
      return 'Meta: Retorno mensal ≥ Aporte mensal'
    }
    return null
  }

  const target = formatTarget()
  const showCheckbox = isManual && onToggle && (mission.missionType !== 'habit' || habitCanComplete || mission.isCompleted)

  return (
    <Item $completed={mission.isCompleted}>
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        {showCheckbox ? (
          <CheckButton
            $completed={mission.isCompleted}
            onClick={() => onToggle!(mission.id, !mission.isCompleted)}
          >
            {mission.isCompleted && <span style={{ color: 'white', fontSize: 11 }}>✓</span>}
          </CheckButton>
        ) : (
          <CheckDisplay $completed={mission.isCompleted}>
            {mission.isCompleted && <span style={{ color: 'white', fontSize: 11 }}>✓</span>}
          </CheckDisplay>
        )}
      </div>

      <Body>
        <TitleRow>
          <span style={{ fontSize: 14 }}>{icon}</span>
          <MissionTitle $completed={mission.isCompleted}>{mission.title}</MissionTitle>
          {!mission.isRequiredForPhase && <BadgeOptional>opcional</BadgeOptional>}
          <BadgeType>{label}</BadgeType>
        </TitleRow>

        {!compact && <Description>{mission.description}</Description>}
        {target && <Target>{target}</Target>}

        {mission.missionType === 'habit' && !mission.isCompleted && (
          <div style={{ marginTop: 8 }}>
            {!mission.startedAt && onStart ? (
              <StartButton onClick={() => onStart(mission.id)}>Iniciar rastreamento</StartButton>
            ) : mission.startedAt ? (
              <HabitProgress>
                <HabitProgressRow>
                  <span>Progresso do hábito</span>
                  <span>{Math.min(elapsedDays!, requiredDays)}/{requiredDays} dias</span>
                </HabitProgressRow>
                <HabitTrack>
                  <HabitFill $width={Math.min((elapsedDays! / requiredDays) * 100, 100)} />
                </HabitTrack>
                {habitCanComplete && (
                  <span style={{ fontSize: 12, color: '#22c55e' }}>Tempo cumprido — marque como concluída acima</span>
                )}
              </HabitProgress>
            ) : null}
          </div>
        )}

        {mission.completedAt && (
          <CompletedDate>
            ✓ Concluída em {new Date(mission.completedAt).toLocaleDateString('pt-BR')}
          </CompletedDate>
        )}
      </Body>
    </Item>
  )
}
