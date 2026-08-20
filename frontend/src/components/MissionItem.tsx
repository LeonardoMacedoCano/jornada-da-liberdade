import styled from 'styled-components'
import { getMissionContent } from '../i18n/content'
import strings from '../i18n/strings'
import { interpolate } from '../i18n'
import { Mission, MISSION_TYPE_ICONS } from '../types'
import { computeMissionProgressPercent, MissionFinancials } from '../utils/missionProgress'

interface MissionItemProps {
  mission: Mission
  minimumWage?: number
  financials?: MissionFinancials
  onToggle?: (id: number, completed: boolean) => void
  onUndo?: (mission: Mission) => void
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
    background: ${p.theme.colors.success}0d;
    border: 1px solid ${p.theme.colors.success}33;
  ` : `
    background: ${p.theme.colors.white}08;
    border: 1px solid ${p.theme.colors.white}0d;
    &:hover { border-color: ${p.theme.colors.white}1a; }
  `}
`

const CheckButton = styled.button<{ $completed: boolean }>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid ${p => p.$completed ? p.theme.colors.success : p.theme.colors.gray};
  background: ${p => p.$completed ? p.theme.colors.success : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  margin-top: 2px;

  &:hover {
    border-color: ${p => p.$completed ? p.theme.colors.warning : p.theme.colors.white};
  }
`

const CheckDisplay = styled.div<{ $completed: boolean }>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid ${p => p.$completed ? p.theme.colors.success : p.theme.colors.tertiary};
  background: ${p => p.$completed ? p.theme.colors.success : 'transparent'};
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
  color: ${p => p.$completed ? p.theme.colors.gray : p.theme.colors.white};
  text-decoration: ${p => p.$completed ? 'line-through' : 'none'};
`

const BadgeOptional = styled.span`
  font-size: 11px;
  background: ${p => p.theme.colors.warning}33;
  color: ${p => p.theme.colors.warning};
  padding: 2px 6px;
  border-radius: 4px;
`

const BadgeType = styled.span`
  font-size: 11px;
  background: ${p => p.theme.colors.white}0d;
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
  background: ${p => p.theme.colors.quaternary}33;
  color: ${p => p.theme.colors.quaternary};
  border: 1px solid ${p => p.theme.colors.quaternary}4d;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: ${p => p.theme.colors.quaternary}66; }
`

const MiniProgress = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const MiniProgressRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: ${p => p.theme.colors.gray};
`

const MiniTrack = styled.div`
  width: 100%;
  background: ${p => p.theme.colors.white}0d;
  border-radius: 999px;
  height: 6px;
  overflow: hidden;
`

const MiniFill = styled.div<{ $width: number }>`
  background: ${p => p.theme.colors.quaternary};
  height: 6px;
  border-radius: 999px;
  width: ${p => p.$width}%;
  transition: width 0.3s;
`

const CompletedDate = styled.p`
  font-size: 12px;
  color: ${p => p.theme.colors.success}b3;
  margin-top: 4px;
`

export default function MissionItem({ mission, minimumWage = 1621, financials, onToggle, onUndo, onStart, compact = false }: MissionItemProps) {
  const content = getMissionContent(mission.slug)
  const isManual = mission.missionType === 'behavioral' || mission.missionType === 'habit'
  const icon = MISSION_TYPE_ICONS[mission.missionType]
  const label = strings.mission.types[mission.missionType]

  const elapsedDays = mission.startedAt
    ? Math.floor((Date.now() - new Date(mission.startedAt).getTime()) / 86400000)
    : null
  const requiredDays = mission.requiredDurationDays ?? 0
  const habitCanComplete = mission.missionType === 'habit' && elapsedDays !== null && elapsedDays >= requiredDays

  function formatTarget() {
    if (mission.missionType === 'portfolio_value' && mission.targetValue) {
      const value = `R$ ${parseFloat(mission.targetValue).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`
      return interpolate(strings.mission.targetPortfolio, { value })
    }
    if (mission.missionType === 'passive_income_sm' && mission.targetSmMultiple) {
      const multiple = parseFloat(mission.targetSmMultiple)
      const value = `R$ ${(multiple * minimumWage).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      return interpolate(strings.mission.targetPassiveSm, { multiple, value })
    }
    if (mission.missionType === 'crossover') {
      return strings.mission.targetCrossover
    }
    return null
  }

  const target = formatTarget()
  const progressPercent = financials ? computeMissionProgressPercent(mission, financials, minimumWage) : null

  const canComplete = isManual && !!onToggle && (mission.missionType !== 'habit' || habitCanComplete)
  const canUndo = mission.isCompleted && !!onUndo
  const interactive = mission.isCompleted ? canUndo : canComplete

  function handleCheckClick() {
    if (mission.isCompleted) {
      onUndo?.(mission)
    } else if (canComplete) {
      onToggle?.(mission.id, true)
    }
  }

  return (
    <Item $completed={mission.isCompleted}>
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        {interactive ? (
          <CheckButton
            role="checkbox"
            aria-checked={mission.isCompleted}
            aria-label={mission.isCompleted ? interpolate(strings.mission.undoAria, { title: content.title }) : content.title}
            $completed={mission.isCompleted}
            onClick={handleCheckClick}
          >
            {mission.isCompleted && <span aria-hidden="true" style={{ color: 'white', fontSize: 11 }}>✓</span>}
          </CheckButton>
        ) : (
          <CheckDisplay role="img" aria-label={mission.isCompleted ? strings.phase.completed : content.title} $completed={mission.isCompleted}>
            {mission.isCompleted && <span aria-hidden="true" style={{ color: 'white', fontSize: 11 }}>✓</span>}
          </CheckDisplay>
        )}
      </div>

      <Body>
        <TitleRow>
          <span aria-hidden="true" style={{ fontSize: 14 }}>{icon}</span>
          <MissionTitle $completed={mission.isCompleted}>{content.title}</MissionTitle>
          {!mission.isRequiredForPhase && <BadgeOptional>{strings.mission.optional}</BadgeOptional>}
          <BadgeType>{label}</BadgeType>
        </TitleRow>

        {!compact && <Description>{content.description}</Description>}
        {target && <Target>{target}</Target>}

        {progressPercent !== null && (
          <MiniProgress>
            <MiniProgressRow>
              <span>{interpolate(strings.mission.percentComplete, { percent: progressPercent })}</span>
            </MiniProgressRow>
            <MiniTrack>
              <MiniFill $width={progressPercent} />
            </MiniTrack>
          </MiniProgress>
        )}

        {mission.missionType === 'habit' && !mission.isCompleted && (
          <div style={{ marginTop: 8 }}>
            {!mission.startedAt && onStart ? (
              <StartButton onClick={() => onStart(mission.id)}>{strings.mission.startTracking}</StartButton>
            ) : mission.startedAt ? (
              <MiniProgress>
                <MiniProgressRow>
                  <span>{strings.mission.habitProgress}</span>
                  <span>{interpolate(strings.mission.habitDays, { elapsed: Math.min(elapsedDays!, requiredDays), required: requiredDays })}</span>
                </MiniProgressRow>
                <MiniTrack>
                  <MiniFill $width={Math.min((elapsedDays! / requiredDays) * 100, 100)} />
                </MiniTrack>
                {habitCanComplete && (
                  <CompletedDate>{strings.mission.habitReady}</CompletedDate>
                )}
              </MiniProgress>
            ) : null}
          </div>
        )}

        {mission.completedAt && (
          <CompletedDate>
            {interpolate(strings.mission.completedOn, { date: new Date(mission.completedAt).toLocaleDateString('pt-BR') })}
          </CompletedDate>
        )}
      </Body>
    </Item>
  )
}
