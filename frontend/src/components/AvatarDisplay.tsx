import styled from 'styled-components'

interface AvatarDisplayProps {
  icon: string
  size?: 'sm' | 'md' | 'lg'
  showTitle?: boolean
  phaseName?: string
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
  background: ${p => p.theme.colors.tertiary}33;
  border: 1px solid ${p => p.theme.colors.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
`

const TitleText = styled.span`
  font-size: 12px;
  color: ${p => p.theme.colors.gray};
`

export default function AvatarDisplay({ icon, size = 'md', showTitle = false, phaseName }: AvatarDisplayProps) {
  const sizeStyle = SIZE_MAP[size]

  return (
    <Wrapper>
      <Circle $size={sizeStyle}>{icon}</Circle>
      {showTitle && phaseName && <TitleText>{phaseName}</TitleText>}
    </Wrapper>
  )
}
