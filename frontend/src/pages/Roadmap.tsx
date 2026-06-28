import { useState, useEffect } from 'react'
import api from '../services/api'
import { Phase } from '../types'
import PhaseCard from '../components/PhaseCard'

export default function Roadmap() {
  const [phases, setPhases] = useState<Phase[]>([])
  const [minimumWage, setMinimumWage] = useState(1412)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/phases'),
      api.get('/config/minimum-wage'),
    ]).then(([phasesRes, wageRes]) => {
      setPhases(phasesRes.data)
      setMinimumWage(wageRes.data.value)
      const active = phasesRes.data.find((p: Phase) => p.status === 'active')
      if (active) setExpandedId(active.id)
    }).finally(() => setLoading(false))
  }, [])

  async function handleToggleMission(id: number, completed: boolean) {
    try {
      await api.post(`/missions/${id}/${completed ? 'complete' : 'uncomplete'}`)
      const res = await api.get('/phases')
      setPhases(res.data)
    } catch { /* ignore */ }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-violet-400 animate-pulse">Carregando Roadmap...</div>
    </div>
  )

  const completedCount = phases.filter(p => p.status === 'completed').length

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Roadmap da Jornada</h1>
        <p className="text-gray-500 mt-1">
          {completedCount}/9 fases concluídas — Todas as fases são visíveis para motivar seu avanço
        </p>
      </div>

      <div className="space-y-3">
        {phases.map((phase, idx) => (
          <div key={phase.id} className="relative">
            {idx < phases.length - 1 && (
              <div className="absolute left-7 top-full h-3 w-0.5 bg-white/10 z-0" />
            )}
            <PhaseCard
              phase={phase}
              minimumWage={minimumWage}
              expanded={expandedId === phase.id}
              onToggleExpand={() => setExpandedId(expandedId === phase.id ? null : phase.id)}
              onToggleMission={handleToggleMission}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
