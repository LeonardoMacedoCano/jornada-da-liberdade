import styled from 'styled-components'
import { Achievement } from '../types'
import { PHASE_HEX_COLORS } from '../types'

interface AchievementBadgeProps {
  achievement: Achievement
  size?: 'sm' | 'lg'
  locked?: boolean
}

const Badge = styled.div<{ $color: string; $isLg: boolean; $locked: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  padding: ${p => p.$isLg ? '16px' : '10px'};
  animation: fadeIn 0.3s ease-out;
  user-select: none;
  position: relative;
  overflow: hidden;

  ${p => p.$locked ? `
    background: ${p.theme.colors.primary};
    border: 1px solid ${p.theme.colors.tertiary};
    opacity: 0.45;
  ` : `
    background: linear-gradient(135deg, ${p.$color}18 0%, ${p.theme.colors.secondary} 60%);
    border: 1px solid ${p.$color}50;
    box-shadow: 0 0 18px ${p.$color}25, 0 0 40px ${p.$color}10, inset 0 1px 0 ${p.$color}30;
  `}
`

const TopGlow = styled.div<{ $color: string }>`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 75%;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${p => p.$color}60, transparent);
`

const Icon = styled.div<{ $color: string; $isLg: boolean; $locked: boolean }>`
  font-size: ${p => p.$isLg ? '44px' : '28px'};
  filter: ${p => p.$locked ? 'grayscale(1)' : `drop-shadow(0 0 8px ${p.$color}90)`};
`

const Name = styled.div<{ $color: string; $isLg: boolean; $locked: boolean }>`
  font-weight: 700;
  font-size: ${p => p.$isLg ? '13px' : '11px'};
  color: ${p => p.$locked ? p.theme.colors.gray : p.$color};
  text-align: center;
`

const PhaseName = styled.div<{ $locked: boolean }>`
  font-size: 11px;
  color: ${p => p.$locked ? `${p.theme.colors.gray}60` : p.theme.colors.gray};
  margin-top: 2px;
  text-align: center;
`

const CompletedAt = styled.div`
  font-size: 11px;
  color: ${p => p.theme.colors.gray};
  margin-top: 4px;
  text-align: center;
`

export default function AchievementBadge({ achievement, size = 'lg', locked = false }: AchievementBadgeProps) {
  const color = PHASE_HEX_COLORS[achievement.color] || PHASE_HEX_COLORS.gray
  const isLg = size === 'lg'

  return (
    <Badge $color={color} $isLg={isLg} $locked={locked}>
      {!locked && <TopGlow $color={color} />}
      <Icon $color={color} $isLg={isLg} $locked={locked}>
        {locked ? '🔒' : achievement.achievementIcon}
      </Icon>
      <div style={{ textAlign: 'center' }}>
        <Name $color={color} $isLg={isLg} $locked={locked}>{achievement.achievementName}</Name>
        <PhaseName $locked={locked}>{achievement.phaseName}</PhaseName>
        {!locked && achievement.completedAt && (
          <CompletedAt>
            {new Date(achievement.completedAt).toLocaleDateString('pt-BR')}
          </CompletedAt>
        )}
      </div>
    </Badge>
  )
}
