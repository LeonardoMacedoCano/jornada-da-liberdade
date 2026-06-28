import { Achievement } from '../types'

interface AchievementBadgeProps {
  achievement: Achievement
  size?: 'sm' | 'lg'
  locked?: boolean
}

const glowColors: Record<string, string> = {
  gray: '#6b7280',
  green: '#22c55e',
  blue: '#3b82f6',
  teal: '#14b8a6',
  purple: '#a855f7',
  orange: '#f97316',
  yellow: '#eab308',
  amber: '#f59e0b',
  red: '#ef4444',
}

export default function AchievementBadge({ achievement, size = 'lg', locked = false }: AchievementBadgeProps) {
  const color = glowColors[achievement.color] || glowColors.gray
  const isLg = size === 'lg'

  if (locked) {
    return (
      <div
        className="flex flex-col items-center gap-2 rounded-xl animate-fade-in select-none"
        style={{
          padding: isLg ? '16px' : '10px',
          background: '#111120',
          border: '1px solid #2d2d4e',
          opacity: 0.45,
        }}
      >
        <div className={`${isLg ? 'text-4xl' : 'text-2xl'} grayscale`}>🔒</div>
        <div className="text-center">
          <div className={`font-bold text-gray-600 ${isLg ? 'text-xs' : 'text-xs'}`}>{achievement.achievementName}</div>
          <div className="text-gray-700 text-xs mt-0.5">{achievement.phaseName}</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col items-center gap-2 rounded-xl animate-fade-in relative overflow-hidden"
      style={{
        padding: isLg ? '16px' : '10px',
        background: `linear-gradient(135deg, ${color}18 0%, #1a1a2e 60%)`,
        border: `1px solid ${color}50`,
        boxShadow: `0 0 18px ${color}25, 0 0 40px ${color}10, inset 0 1px 0 ${color}30`,
      }}
    >
      {/* brilho no topo */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }}
      />

      <div
        className={`${isLg ? 'text-5xl' : 'text-3xl'}`}
        style={{ filter: `drop-shadow(0 0 8px ${color}90)` }}
      >
        {achievement.achievementIcon}
      </div>
      <div className="text-center">
        <div
          className={`font-bold ${isLg ? 'text-sm' : 'text-xs'}`}
          style={{ color }}
        >
          {achievement.achievementName}
        </div>
        <div className="text-gray-400 text-xs mt-0.5">{achievement.phaseName}</div>
        {achievement.completedAt && (
          <div className="text-gray-600 text-xs mt-1">
            {new Date(achievement.completedAt).toLocaleDateString('pt-BR')}
          </div>
        )}
      </div>
    </div>
  )
}
