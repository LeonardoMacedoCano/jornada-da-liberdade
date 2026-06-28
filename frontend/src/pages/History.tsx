import { useState, useEffect } from 'react'
import api from '../services/api'
import { Phase, Mission, MISSION_TYPE_ICONS, MISSION_TYPE_LABELS } from '../types'
import AchievementBadge from '../components/AchievementBadge'

interface CompletedMission extends Mission {
  phaseName: string
  phaseColor: string
}

export default function History() {
  const [phases, setPhases] = useState<Phase[]>([])
  const [completedMissions, setCompletedMissions] = useState<CompletedMission[]>([])
  const [filterPhaseId, setFilterPhaseId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/phases').then(res => {
      const data: Phase[] = res.data
      setPhases(data)
      const missions: CompletedMission[] = []
      data.forEach(phase => {
        phase.missions.forEach(m => {
          if (m.isCompleted && m.completedAt) {
            missions.push({ ...m, phaseName: phase.name, phaseColor: phase.color })
          }
        })
      })
      missions.sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      setCompletedMissions(missions)
    }).finally(() => setLoading(false))
  }, [])

  const unlockedCount = phases.filter(p => p.status === 'completed').length

  const allBadges = phases.map(p => ({
    achievement: {
      phaseId: p.id,
      phaseName: p.name,
      achievementName: p.achievementName,
      achievementIcon: p.achievementIcon,
      color: p.color,
      completedAt: p.completedAt || '',
    },
    locked: p.status !== 'completed',
    completedAt: p.completedAt,
  }))

  const filtered = filterPhaseId !== null
    ? completedMissions.filter(m => m.phaseId === filterPhaseId)
    : completedMissions

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-violet-400 animate-pulse">Carregando histórico...</div>
    </div>
  )

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Histórico</h1>
        <p className="text-gray-500 mt-1">Conquistas desbloqueadas e missões concluídas</p>
      </div>

      {/* Vitrine de Conquistas */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold text-white">Vitrine de Conquistas</h2>
          <span className="text-sm text-gray-600">{unlockedCount}/9 desbloqueadas</span>
        </div>

        <div
          className="rounded-xl p-6"
          style={{ background: '#0f0f1a', border: '1px solid #2d2d4e' }}
        >
          {/* "prateleira" */}
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {allBadges.map(({ achievement, locked }) => (
              <AchievementBadge
                key={achievement.phaseId}
                achievement={achievement}
                size="lg"
                locked={locked}
              />
            ))}
          </div>

          {unlockedCount === 0 && (
            <p className="text-center text-gray-600 text-sm mt-4">
              Complete a Fase Tutorial para desbloquear a primeira conquista.
            </p>
          )}
        </div>
      </section>

      {/* Linha do Tempo */}
      <section>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-white">
            Missões Concluídas{' '}
            <span className="text-gray-500 text-base font-normal">({filtered.length})</span>
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilterPhaseId(null)}
              className={`px-3 py-1 rounded-lg text-xs transition-colors ${filterPhaseId === null ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white bg-white/5'}`}
            >
              Todas
            </button>
            {phases.filter(p => p.missions.some(m => m.isCompleted)).map(p => (
              <button
                key={p.id}
                onClick={() => setFilterPhaseId(p.id)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${filterPhaseId === p.id ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white bg-white/5'}`}
              >
                {p.achievementIcon} {p.name}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-600 rounded-xl" style={{ background: '#1a1a2e', border: '1px solid #2d2d4e' }}>
            <div className="text-4xl mb-3">🎯</div>
            <p>Nenhuma missão concluída ainda. Comece pela Fase Tutorial!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(mission => (
              <div key={mission.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#1a1a2e', border: '1px solid #2d2d4e' }}>
                <span className="text-lg flex-shrink-0">{MISSION_TYPE_ICONS[mission.missionType]}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-white font-medium">{mission.title}</span>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-gray-500">{mission.phaseName}</span>
                    <span className="text-xs text-gray-600">·</span>
                    <span className="text-xs text-gray-600">{MISSION_TYPE_LABELS[mission.missionType]}</span>
                  </div>
                </div>
                <div className="text-xs text-green-500/70 flex-shrink-0">
                  {mission.completedAt ? new Date(mission.completedAt).toLocaleDateString('pt-BR') : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
