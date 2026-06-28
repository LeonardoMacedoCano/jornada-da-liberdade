import { Phase, PHASE_BORDER_COLORS, PHASE_TEXT_COLORS } from '../types'
import ProgressBar from './ProgressBar'
import MissionItem from './MissionItem'

const PROGRESS_BAR_COLORS: Record<string, string> = {
  gray: 'bg-gray-400', green: 'bg-green-400', blue: 'bg-blue-400',
  teal: 'bg-teal-400', purple: 'bg-violet-500', orange: 'bg-orange-400',
  yellow: 'bg-yellow-400', amber: 'bg-amber-400', red: 'bg-red-400',
}

interface PhaseCardProps {
  phase: Phase
  minimumWage?: number
  expanded?: boolean
  onToggleExpand?: () => void
  onToggleMission?: (id: number, completed: boolean) => void
}

export default function PhaseCard({ phase, minimumWage = 1412, expanded = false, onToggleExpand, onToggleMission }: PhaseCardProps) {
  const borderColor = PHASE_BORDER_COLORS[phase.color] || 'border-l-gray-400'
  const textColor = PHASE_TEXT_COLORS[phase.color] || 'text-gray-400'
  const barColor = PROGRESS_BAR_COLORS[phase.color] || 'bg-gray-400'
  const isLocked = phase.status === 'locked'
  const isCompleted = phase.status === 'completed'
  const isActive = phase.status === 'active'

  return (
    <div className={`rounded-xl border-l-4 ${borderColor} ${isLocked ? 'opacity-60' : ''} ${isActive ? 'ring-1 ring-violet-500/50' : ''}`}
      style={{ background: '#1a1a2e', borderRight: '1px solid #2d2d4e', borderTop: '1px solid #2d2d4e', borderBottom: '1px solid #2d2d4e' }}>
      <button
        onClick={onToggleExpand}
        className="w-full text-left p-4 flex items-start gap-4 hover:bg-white/3 transition-colors rounded-r-xl"
      >
        <div className={`text-3xl flex-shrink-0 mt-0.5 ${isLocked ? 'grayscale opacity-50' : ''}`}>
          {phase.achievementIcon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold uppercase tracking-wider ${textColor}`}>{phase.name}</span>
            {isCompleted && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">✓ Concluída</span>}
            {isActive && <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">● Atual</span>}
            {isLocked && <span className="text-xs bg-white/5 text-gray-600 px-2 py-0.5 rounded-full">🔒 Bloqueada</span>}
          </div>
          <div className="text-white font-semibold mt-0.5">{phase.title}</div>
          <div className="text-gray-500 text-sm">{phase.subtitle}</div>
          {(isActive || isCompleted) && (
            <div className="mt-2">
              <ProgressBar percent={phase.progressPercent} color={barColor} showLabel />
            </div>
          )}
          {isCompleted && phase.completedAt && (
            <div className="text-xs text-green-500/70 mt-1">
              Concluída em {new Date(phase.completedAt).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>
        <div className="text-gray-600 text-sm flex-shrink-0">{expanded ? '▲' : '▼'}</div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/5">
          <p className="text-gray-400 text-sm my-3 italic">&quot;{phase.flavorText}&quot;</p>
          <p className="text-gray-500 text-sm mb-4">{phase.description}</p>
          <div className="space-y-2">
            {phase.missions.map(mission => (
              <MissionItem
                key={mission.id}
                mission={mission}
                minimumWage={minimumWage}
                onToggle={isActive ? onToggleMission : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
