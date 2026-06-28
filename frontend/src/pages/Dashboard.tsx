import { useState, useEffect, FormEvent } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { Phase, UserProgress } from '../types'
import AvatarDisplay from '../components/AvatarDisplay'
import ProgressBar from '../components/ProgressBar'
import MissionItem from '../components/MissionItem'
import ShareButton from '../components/ShareButton'

const PROGRESS_BAR_COLORS: Record<string, string> = {
  gray: 'bg-gray-400', green: 'bg-green-400', blue: 'bg-blue-400',
  teal: 'bg-teal-400', purple: 'bg-violet-500', orange: 'bg-orange-400',
  yellow: 'bg-yellow-400', amber: 'bg-amber-400', red: 'bg-red-400',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [phase, setPhase] = useState<Phase | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [minimumWage, setMinimumWage] = useState(1412)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const [form, setForm] = useState({
    investedAmount: '',
    monthlyPassiveIncome: '',
    monthlyContribution: '',
    annualReturnRate: '11',
  })

  useEffect(() => {
    Promise.all([
      api.get('/phases/current'),
      api.get('/user/profile'),
      api.get('/config/minimum-wage'),
    ]).then(([phaseRes, profileRes, wageRes]) => {
      setPhase(phaseRes.data)
      const prog = profileRes.data.progress
      setProgress(prog)
      setMinimumWage(wageRes.data.value)
      if (prog) {
        setForm({
          investedAmount: parseFloat(prog.investedAmount).toString(),
          monthlyPassiveIncome: parseFloat(prog.monthlyPassiveIncome).toString(),
          monthlyContribution: parseFloat(prog.monthlyContribution).toString(),
          annualReturnRate: parseFloat(prog.annualReturnRate).toString(),
        })
      }
    }).catch(() => {
      setError('Não foi possível carregar os dados. Tente recarregar a página.')
    }).finally(() => setLoading(false))
  }, [])

  async function handleProgressUpdate(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.put('/user/progress', {
        investedAmount: parseFloat(form.investedAmount) || 0,
        monthlyPassiveIncome: parseFloat(form.monthlyPassiveIncome) || 0,
        monthlyContribution: parseFloat(form.monthlyContribution) || 0,
        annualReturnRate: parseFloat(form.annualReturnRate) || 11,
      })
      setProgress(res.data.progress)
      if (res.data.phaseAdvanced) {
        showToast(`🏆 Fase concluída! Avançou para a próxima fase!`)
      } else if (res.data.newlyCompleted?.length > 0) {
        showToast(`✅ ${res.data.newlyCompleted.length} missão(ões) completada(s) automaticamente!`)
      }
      const phaseRes = await api.get('/phases/current')
      setPhase(phaseRes.data)
    } catch {
      showToast('Erro ao salvar progresso. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleMission(id: number, completed: boolean) {
    try {
      const res = await api.post(`/missions/${id}/${completed ? 'complete' : 'uncomplete'}`)
      const [phaseRes, profileRes] = await Promise.all([
        api.get('/phases/current'),
        api.get('/user/profile'),
      ])
      setPhase(phaseRes.data)
      setProgress(profileRes.data.progress)
      if (completed) showToast('✅ Missão concluída!')
      if (!completed && res.data.phaseRolledBack) {
        showToast(`⚠️ Fase revertida para: ${phaseRes.data.name}`)
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? 'Erro ao atualizar missão. Tente novamente.'
      showToast(msg)
    }
  }

  async function handleStartMission(id: number) {
    try {
      await api.post(`/missions/${id}/start`)
      const phaseRes = await api.get('/phases/current')
      setPhase(phaseRes.data)
      showToast('🔄 Rastreamento iniciado!')
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? 'Erro ao iniciar rastreamento.'
      showToast(msg)
    }
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const invested = parseFloat(form.investedAmount) || 0
  const annualRate = parseFloat(form.annualReturnRate) || 11
  const contribution = parseFloat(form.monthlyContribution) || 0
  const passive = parseFloat(form.monthlyPassiveIncome) || 0
  const monthlyReturn = invested * (annualRate / 100 / 12)
  const crossoverReached = contribution > 0 && monthlyReturn >= contribution
  const smMultiple = minimumWage > 0 ? passive / minimumWage : 0

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-violet-400 animate-pulse">Carregando...</div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-6 py-4 rounded-xl bg-violet-600 text-white font-semibold shadow-2xl animate-fade-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <AvatarDisplay phaseId={progress?.currentPhaseId ?? 0} size="md" />
        <div>
          <h1 className="text-2xl font-bold text-white">Olá, {user?.name}!</h1>
          <p className="text-gray-400">
            {phase ? `${phase.achievementIcon} ${phase.name} — ${phase.title}` : 'Carregando fase...'}
          </p>
          <p className="text-gray-600 text-sm mt-1">@{user?.username}</p>
        </div>
        <div className="ml-auto">
          {user && <ShareButton username={user.username} />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fase Atual */}
        <div className="lg:col-span-2 space-y-4">
          {phase && (
            <div className="rounded-xl p-5" style={{ background: '#1a1a2e', border: '1px solid #2d2d4e' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Fase Atual</span>
                  <h2 className="text-lg font-bold text-white">{phase.title}</h2>
                  <p className="text-gray-500 text-sm">{phase.subtitle}</p>
                </div>
                <div className="text-4xl">{phase.achievementIcon}</div>
              </div>
              <ProgressBar
                percent={phase.progressPercent}
                color={PROGRESS_BAR_COLORS[phase.color] || 'bg-violet-500'}
                height="h-3"
                showLabel
              />
              <p className="text-gray-500 text-sm mt-3 italic">&quot;{phase.flavorText}&quot;</p>
            </div>
          )}

          {/* Missões da fase */}
          <div className="rounded-xl p-5" style={{ background: '#1a1a2e', border: '1px solid #2d2d4e' }}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Missões da Fase</h3>
            <div className="space-y-2">
              {phase?.missions.map(mission => (
                <MissionItem
                  key={mission.id}
                  mission={mission}
                  minimumWage={minimumWage}
                  onToggle={handleToggleMission}
                  onStart={handleStartMission}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Painel lateral */}
        <div className="space-y-4">
          {/* Formulário de atualização */}
          <div className="rounded-xl p-5" style={{ background: '#1a1a2e', border: '1px solid #2d2d4e' }}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Atualizar Dados</h3>
            <form onSubmit={handleProgressUpdate} className="space-y-3">
              {[
                { label: 'Patrimônio investido (R$)', key: 'investedAmount', placeholder: '0' },
                { label: 'Renda passiva mensal (R$)', key: 'monthlyPassiveIncome', placeholder: '0' },
                { label: 'Aporte mensal (R$)', key: 'monthlyContribution', placeholder: '0' },
                { label: 'Taxa de retorno anual (%)', key: 'annualReturnRate', placeholder: '11' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <input
                    type="number" step="0.01" min="0"
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 rounded-lg text-white text-sm placeholder-gray-700 outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                    style={{ background: '#0f0f1a', border: '1px solid #2d2d4e' }}
                  />
                </div>
              ))}
              <button
                type="submit" disabled={saving}
                className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                {saving ? 'Salvando...' : 'Atualizar Progresso'}
              </button>
            </form>
          </div>

          {/* Indicadores */}
          <div className="rounded-xl p-5" style={{ background: '#1a1a2e', border: '1px solid #2d2d4e' }}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Indicadores</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Retorno mensal estimado</span>
                <span className="text-sm font-semibold text-white">
                  R$ {monthlyReturn.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Ponto de Cruzamento</span>
                <span className={`text-sm font-semibold ${crossoverReached ? 'text-green-400' : 'text-gray-600'}`}>
                  {crossoverReached ? '✓ Atingido' : contribution > 0 ? `${Math.round((monthlyReturn / contribution) * 100)}%` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Renda passiva em SM</span>
                <span className="text-sm font-semibold text-violet-400">
                  {smMultiple.toFixed(2)}× SM
                </span>
              </div>
              <div className="pt-2 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Salário Mínimo atual</span>
                  <span className="text-xs text-gray-500">
                    R$ {minimumWage.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
