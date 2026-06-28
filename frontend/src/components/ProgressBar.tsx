import styled from 'styled-components'

interface ProgressBarProps {
  percent: number
  color?: string
  height?: string
  showLabel?: boolean
}

const Track = styled.div<{ $height: string }>`
  width: 100%;
  height: ${p => p.$height};
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
`

const Fill = styled.div<{ $width: number; $color: string; $height: string }>`
  height: ${p => p.$height};
  border-radius: 999px;
  background: ${p => p.$color};
  width: ${p => Math.min(p.$width, 100)}%;
  transition: width 0.5s ease;
`

const LabelText = styled.div`
  text-align: right;
  font-size: 12px;
  color: ${p => p.theme.colors.gray};
  margin-top: 4px;
`

export default function ProgressBar({
  percent,
  color = '#7c3aed',
  height = '8px',
  showLabel = false,
}: ProgressBarProps) {
  return (
    <div style={{ width: '100%' }}>
      <Track $height={height}>
        <Fill $width={percent} $color={color} $height={height} />
      </Track>
      {showLabel && <LabelText>{percent}%</LabelText>}
    </div>
  )
}
