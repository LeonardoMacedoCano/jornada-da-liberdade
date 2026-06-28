import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { PublicProfile as PublicProfileType } from '../types'
import AvatarDisplay from '../components/AvatarDisplay'
import AchievementBadge from '../components/AchievementBadge'
import ProgressBar from '../components/ProgressBar'
import ShareButton from '../components/ShareButton'

const PROGRESS_BAR_COLORS: Record<string, string> = {
  gray: 'bg-gray-400', green: 'bg-green-400', blue: 'bg-blue-400',
  teal: 'bg-teal-400', purple: 'bg-violet-500', orange: 'bg-orange-400',
  yellow: 'bg-yellow-400', amber: 'bg-amber-400', red: 'bg-red-400',
}

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>()
  const [profile, setProfile] = useState<PublicProfileType | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/share/${username}`)
      .then(res => setProfile(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [username])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f1a' }}>
      <div className="text-violet-400 animate-pulse">Carregando perfil...</div>
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f1a' }}>
      <div className="text-center animate-fade-in">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-2">Perfil não encontrado</h1>
        <p className="text-gray-500 mb-6">Este perfil é privado ou não existe.</p>
        <Link to="/login" className="px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors">
          Criar minha conta
        </Link>
      </div>
    </div>
  )

  if (!profile) return null

  const barColor = profile.currentPhase ? PROGRESS_BAR_COLORS[profile.currentPhase.color] || 'bg-violet-500' : 'bg-violet-500'
  const daysSinceStart = Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen" style={{ background: '#0f0f1a' }}>
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <AvatarDisplay phaseId={profile.currentPhase?.id ?? 0} size="lg" />
          <div>
            <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
            <p className="text-gray-500 mt-1">@{profile.username}</p>
            <p className="text-gray-600 text-sm mt-2">
              Na jornada há {daysSinceStart} dias · desde {new Date(profile.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Fase atual */}
        {profile.currentPhase && (
          <div className="rounded-xl p-5 text-center" style={{ background: '#1a1a2e', border: '1px solid #2d2d4e' }}>
            <div className="text-4xl mb-2">{profile.currentPhase.achievementIcon}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-violet-400">{profile.currentPhase.name}</div>
            <div className="text-lg font-bold text-white mt-1">{profile.currentPhase.title}</div>
            <div className="mt-3 max-w-xs mx-auto">
              <ProgressBar percent={profile.progressPercent} color={barColor} showLabel />
            </div>
            <p className="text-xs text-gray-500 mt-2">{profile.progressPercent}% da fase concluída</p>
          </div>
        )}

        {/* Conquistas */}
        {profile.achievements.length > 0 && (
          <div className="rounded-xl p-5" style={{ background: '#1a1a2e', border: '1px solid #2d2d4e' }}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
              🏆 Conquistas ({profile.achievements.length})
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {profile.achievements.map(a => (
                <AchievementBadge key={a.phaseId} achievement={a} size="sm" />
              ))}
            </div>
          </div>
        )}

        {/* Dados financeiros (se permitido) */}
        {profile.financialData && (
          <div className="rounded-xl p-5" style={{ background: '#1a1a2e', border: '1px solid #2d2d4e' }}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">📊 Dados Financeiros</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-500">Patrimônio Investido</div>
                <div className="text-lg font-bold text-white mt-1">
                  R$ {parseFloat(profile.financialData.investedAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Renda Passiva Mensal</div>
                <div className="text-lg font-bold text-green-400 mt-1">
                  R$ {parseFloat(profile.financialData.monthlyPassiveIncome).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share + CTA */}
        <div className="flex flex-col items-center gap-4">
          <ShareButton username={profile.username} />
          <p className="text-gray-600 text-sm">
            Quer acompanhar sua própria jornada?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300">Criar conta grátis</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
