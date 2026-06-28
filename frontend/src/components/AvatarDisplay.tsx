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

const SIZES: Record<string, string> = {
  sm: 'text-3xl w-12 h-12',
  md: 'text-5xl w-20 h-20',
  lg: 'text-7xl w-28 h-28',
}

export default function AvatarDisplay({ phaseId, size = 'md', showTitle = false, phaseName }: AvatarDisplayProps) {
  const avatar = PHASE_AVATARS[phaseId] ?? '🌱'
  const sizeClass = SIZES[size]

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${sizeClass} rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center`}>
        {avatar}
      </div>
      {showTitle && phaseName && (
        <span className="text-xs text-gray-400">{phaseName}</span>
      )}
    </div>
  )
}
