import styled from 'styled-components'
import { Phase, PHASE_HEX_COLORS } from '../types'
import ProgressBar from './ProgressBar'
import MissionItem from './MissionItem'

interface PhaseCardProps {
  phase: Phase
  minimumWage?: number
  expanded?: boolean
  onToggleExpand?: () => void
  onToggleMission?: (id: number, completed: boolean) => void
}

const Card = styled.div<{ $color: string; $isActive: boolean; $isLocked: boolean }>`
  border-radius: 12px;
  border-left: 4px solid ${p => p.$color};
  border-right: 1px solid ${p => p.theme.colors.tertiary};
  border-top: 1px solid ${p => p.theme.colors.tertiary};
  border-bottom: 1px solid ${p => p.theme.colors.tertiary};
  background: ${p => p.theme.colors.secondary};
  opacity: ${p => p.$isLocked ? 0.6 : 1};
  outline: ${p => p.$isActive ? `1px solid ${p.theme.colors.quaternary}50` : 'none'};
`

const Header = styled.button`
  width: 100%;
  text-align: left;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 0 12px 12px 0;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`

const PhaseIcon = styled.div<{ $locked: boolean }>`
  font-size: 28px;
  flex-shrink: 0;
  margin-top: 2px;
  filter: ${p => p.$locked ? 'grayscale(1) opacity(0.5)' : 'none'};
`

const HeaderBody = styled.div`
  flex: 1;
  min-width: 0;
`

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

const PhaseName = styled.span<{ $color: string }>`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${p => p.$color};
`

const StatusBadge = styled.span<{ $variant: 'completed' | 'active' | 'locked' }>`
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  ${p => p.$variant === 'completed' && `background: rgba(34,197,94,0.2); color: #22c55e;`}
  ${p => p.$variant === 'active' && `background: rgba(124,58,237,0.2); color: #a78bfa;`}
  ${p => p.$variant === 'locked' && `background: rgba(255,255,255,0.05); color: #4b5563;`}
`

const PhaseTitle = styled.div`
  font-weight: 600;
  color: ${p => p.theme.colors.white};
  margin-top: 2px;
`

const PhaseSubtitle = styled.div`
  font-size: 14px;
  color: ${p => p.theme.colors.gray};
`

const CompletedDate = styled.div`
  font-size: 12px;
  color: rgba(34, 197, 94, 0.7);
  margin-top: 4px;
`

const Chevron = styled.div`
  font-size: 13px;
  color: #4b5563;
  flex-shrink: 0;
`

const Body = styled.div`
  padding: 0 16px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`

const FlavorText = styled.p`
  font-size: 14px;
  color: #9ca3af;
  margin: 12px 0;
  font-style: italic;
`

const Description = styled.p`
  font-size: 14px;
  color: ${p => p.theme.colors.gray};
  margin-bottom: 16px;
`

const MissionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export default function PhaseCard({ phase, minimumWage = 1412, expanded = false, onToggleExpand, onToggleMission }: PhaseCardProps) {
  const color = PHASE_HEX_COLORS[phase.color] || PHASE_HEX_COLORS.gray
  const isLocked = phase.status === 'locked'
  const isCompleted = phase.status === 'completed'
  const isActive = phase.status === 'active'

  return (
    <Card $color={color} $isActive={isActive} $isLocked={isLocked}>
      <Header onClick={onToggleExpand}>
        <PhaseIcon $locked={isLocked}>{phase.achievementIcon}</PhaseIcon>
        <HeaderBody>
          <TopRow>
            <PhaseName $color={color}>{phase.name}</PhaseName>
            {isCompleted && <StatusBadge $variant="completed">✓ Concluída</StatusBadge>}
            {isActive && <StatusBadge $variant="active">● Atual</StatusBadge>}
            {isLocked && <StatusBadge $variant="locked">🔒 Bloqueada</StatusBadge>}
          </TopRow>
          <PhaseTitle>{phase.title}</PhaseTitle>
          <PhaseSubtitle>{phase.subtitle}</PhaseSubtitle>
          {(isActive || isCompleted) && (
            <div style={{ marginTop: 8 }}>
              <ProgressBar percent={phase.progressPercent} color={color} height="8px" showLabel />
            </div>
          )}
          {isCompleted && phase.completedAt && (
            <CompletedDate>
              Concluída em {new Date(phase.completedAt).toLocaleDateString('pt-BR')}
            </CompletedDate>
          )}
        </HeaderBody>
        <Chevron>{expanded ? '▲' : '▼'}</Chevron>
      </Header>

      {expanded && (
        <Body>
          <FlavorText>&quot;{phase.flavorText}&quot;</FlavorText>
          <Description>{phase.description}</Description>
          <MissionList>
            {phase.missions.map(mission => (
              <MissionItem
                key={mission.id}
                mission={mission}
                minimumWage={minimumWage}
                onToggle={isActive ? onToggleMission : undefined}
              />
            ))}
          </MissionList>
        </Body>
      )}
    </Card>
  )
}
