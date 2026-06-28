import styled from 'styled-components'

interface AvatarDisplayProps {
  phaseId: number
  size?: 'sm' | 'md' | 'lg'
  showTitle?: boolean
  phaseName?: string
}

const PHASE_AVATARS: Record<number, string> = {
  0: '🌱', 1: '🌿', 2: '⚔️', 3: '🛡️',
  4: '🦅', 5: '🔥', 6: '👑', 7: '🏆', 8: '💎',
}

const SIZE_MAP = {
  sm: { fontSize: '28px', width: '48px', height: '48px' },
  md: { fontSize: '44px', width: '80px', height: '80px' },
  lg: { fontSize: '64px', width: '112px', height: '112px' },
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`

const Circle = styled.div<{ $size: typeof SIZE_MAP['sm'] }>`
  width: ${p => p.$size.width};
  height: ${p => p.$size.height};
  font-size: ${p => p.$size.fontSize};
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`

const TitleText = styled.span`
  font-size: 12px;
  color: ${p => p.theme.colors.gray};
`

export default function AvatarDisplay({ phaseId, size = 'md', showTitle = false, phaseName }: AvatarDisplayProps) {
  const avatar = PHASE_AVATARS[phaseId] ?? '🌱'
  const sizeStyle = SIZE_MAP[size]

  return (
    <Wrapper>
      <Circle $size={sizeStyle}>{avatar}</Circle>
      {showTitle && phaseName && <TitleText>{phaseName}</TitleText>}
    </Wrapper>
  )
}
