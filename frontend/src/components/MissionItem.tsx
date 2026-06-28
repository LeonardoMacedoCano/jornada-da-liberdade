import { Mission, MISSION_TYPE_ICONS, MISSION_TYPE_LABELS } from '../types'

interface MissionItemProps {
  mission: Mission
  minimumWage?: number
  onToggle?: (id: number, completed: boolean) => void
  onStart?: (id: number) => void
  compact?: boolean
}

export default function MissionItem({ mission, minimumWage = 1412, onToggle, onStart, compact = false }: MissionItemProps) {
  const isManual = mission.missionType === 'behavioral' || mission.missionType === 'habit'
  const icon = MISSION_TYPE_ICONS[mission.missionType]
  const label = MISSION_TYPE_LABELS[mission.missionType]

  const elapsedDays = mission.startedAt
    ? Math.floor((Date.now() - new Date(mission.startedAt).getTime()) / 86400000)
    : null
  const requiredDays = mission.requiredDurationDays ?? 0
  const habitCanComplete = mission.missionType === 'habit' && elapsedDays !== null && elapsedDays >= requiredDays

  function formatTarget() {
    if (mission.missionType === 'portfolio_value' && mission.targetValue) {
      return `Meta: R$ ${parseFloat(mission.targetValue).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`
    }
    if (mission.missionType === 'passive_income_sm' && mission.targetSmMultiple) {
      const multiple = parseFloat(mission.targetSmMultiple)
      const value = multiple * minimumWage
      return `Meta: ${multiple}× SM = R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês`
    }
    if (mission.missionType === 'crossover') {
      return 'Meta: Retorno mensal ≥ Aporte mensal'
    }
    return null
  }

  const target = formatTarget()
  const showCheckbox = isManual && onToggle && (mission.missionType !== 'habit' || habitCanComplete || mission.isCompleted)

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg transition-all ${mission.isCompleted ? 'bg-green-500/5 border border-green-500/20' : 'bg-white/3 border border-white/5 hover:border-white/10'} animate-slide-in`}>
      <div className="flex-shrink-0 mt-0.5">
        {showCheckbox ? (
          <button
            onClick={() => onToggle(mission.id, !mission.isCompleted)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              mission.isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-600 hover:border-gray-400'
            }`}
          >
            {mission.isCompleted && <span className="text-white text-xs">✓</span>}
          </button>
        ) : (
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
            mission.isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-700'
          }`}>
            {mission.isCompleted && <span className="text-white text-xs">✓</span>}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm">{icon}</span>
          <span className={`text-sm font-medium ${mission.isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>
            {mission.title}
          </span>
          {!mission.isRequiredForPhase && (
            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">opcional</span>
          )}
          <span className="text-xs bg-white/5 text-gray-500 px-1.5 py-0.5 rounded">{label}</span>
        </div>
        {!compact && (
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{mission.description}</p>
        )}
        {target && (
          <p className="text-xs text-violet-400 mt-1 font-medium">{target}</p>
        )}
        {mission.missionType === 'habit' && !mission.isCompleted && (
          <div className="mt-2">
            {!mission.startedAt && onStart ? (
              <button
                onClick={() => onStart(mission.id)}
                className="text-xs px-3 py-1 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 text-violet-400 border border-violet-500/30 transition-colors"
              >
                Iniciar rastreamento
              </button>
            ) : mission.startedAt ? (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Progresso do hábito</span>
                  <span>{Math.min(elapsedDays!, requiredDays)}/{requiredDays} dias</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div
                    className="bg-violet-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min((elapsedDays! / requiredDays) * 100, 100)}%` }}
                  />
                </div>
                {habitCanComplete && (
                  <p className="text-xs text-green-400">Tempo cumprido — marque como concluída acima</p>
                )}
              </div>
            ) : null}
          </div>
        )}
        {mission.completedAt && (
          <p className="text-xs text-green-500/70 mt-1">
            ✓ Concluída em {new Date(mission.completedAt).toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>
    </div>
  )
}
