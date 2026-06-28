interface ProgressBarProps {
  percent: number
  color?: string
  height?: string
  showLabel?: boolean
}

export default function ProgressBar({ percent, color = 'bg-violet-500', height = 'h-2', showLabel = false }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className={`w-full ${height} rounded-full bg-white/10 overflow-hidden`}>
        <div
          className={`${height} rounded-full ${color} transition-all duration-500`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-right text-xs text-gray-500 mt-1">{percent}%</div>
      )}
    </div>
  )
}
