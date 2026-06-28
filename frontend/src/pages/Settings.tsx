import { useState, useEffect, FormEvent } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

export default function Settings() {
  const { user, refreshUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [username, setUsername] = useState(user?.username || '')
  const [sharePublicProfile, setSharePublicProfile] = useState(user?.sharePublicProfile ?? true)
  const [showFinancialValues, setShowFinancialValues] = useState(user?.showFinancialValues ?? false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [minimumWage, setMinimumWage] = useState('')
  const [wageUpdatedAt, setWageUpdatedAt] = useState<string | null>(null)
  const [profileMsg, setProfileMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [wageMsg, setWageMsg] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [savingWage, setSavingWage] = useState(false)

  useEffect(() => {
    api.get('/config/minimum-wage').then(res => {
      setMinimumWage(res.data.value.toString())
      setWageUpdatedAt(res.data.updatedAt)
    })
  }, [])

  async function handleProfileSave(e: FormEvent) {
    e.preventDefault()
    setProfileMsg('')
    setSavingProfile(true)
    try {
      await api.put('/user/settings', { name, username, sharePublicProfile, showFinancialValues })
      await refreshUser()
      setProfileMsg('✓ Perfil atualizado com sucesso!')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setProfileMsg(msg || 'Erro ao salvar')
    } finally {
      setSavingProfile(false)
      setTimeout(() => setProfileMsg(''), 3000)
    }
  }

  async function handlePasswordSave(e: FormEvent) {
    e.preventDefault()
    setPasswordMsg('')
    setSavingPassword(true)
    try {
      await api.put('/user/password', { currentPassword, newPassword })
      setPasswordMsg('✓ Senha alterada com sucesso!')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setPasswordMsg(msg || 'Erro ao alterar senha')
    } finally {
      setSavingPassword(false)
      setTimeout(() => setPasswordMsg(''), 3000)
    }
  }

  async function handleWageSave(e: FormEvent) {
    e.preventDefault()
    setWageMsg('')
    setSavingWage(true)
    try {
      const res = await api.put('/config/minimum-wage', { value: parseFloat(minimumWage) })
      setWageUpdatedAt(res.data.updatedAt)
      setWageMsg('✓ Salário mínimo atualizado!')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setWageMsg(msg || 'Erro ao atualizar')
    } finally {
      setSavingWage(false)
      setTimeout(() => setWageMsg(''), 3000)
    }
  }

  const cardClass = "rounded-xl p-6 space-y-4"
  const cardStyle = { background: '#1a1a2e', border: '1px solid #2d2d4e' }
  const inputClass = "w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-violet-500 transition-all text-sm"
  const inputStyle = { background: '#0f0f1a', border: '1px solid #2d2d4e' }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-gray-500 mt-1">Gerencie seu perfil e preferências</p>
      </div>

      {/* Perfil */}
      <div className={cardClass} style={cardStyle}>
        <h2 className="text-lg font-semibold text-white">Perfil</h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nome</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value.toLowerCase())} className={inputClass} style={inputStyle} />
            <p className="text-xs text-gray-600 mt-1">URL do perfil público: /p/{username}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">E-mail <span className="text-gray-600">(somente leitura)</span></label>
            <input type="email" value={user?.email || ''} readOnly className={`${inputClass} opacity-50 cursor-not-allowed`} style={inputStyle} />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setSharePublicProfile(!sharePublicProfile)}
                className={`w-11 h-6 rounded-full transition-colors relative ${sharePublicProfile ? 'bg-violet-600' : 'bg-gray-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${sharePublicProfile ? 'left-6' : 'left-1'}`} />
              </div>
              <div>
                <span className="text-sm text-white">Perfil público ativo</span>
                <p className="text-xs text-gray-500">Permite que sua página /p/{username} seja acessada</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setShowFinancialValues(!showFinancialValues)}
                className={`w-11 h-6 rounded-full transition-colors relative ${showFinancialValues ? 'bg-violet-600' : 'bg-gray-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${showFinancialValues ? 'left-6' : 'left-1'}`} />
              </div>
              <div>
                <span className="text-sm text-white">Mostrar valores financeiros no perfil público</span>
                <p className="text-xs text-gray-500">Exibe patrimônio e renda passiva para visitantes</p>
              </div>
            </label>
          </div>

          {profileMsg && <p className={`text-sm ${profileMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{profileMsg}</p>}
          <button type="submit" disabled={savingProfile} className="px-6 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors">
            {savingProfile ? 'Salvando...' : 'Salvar Perfil'}
          </button>
        </form>
      </div>

      {/* Senha */}
      <div className={cardClass} style={cardStyle}>
        <h2 className="text-lg font-semibold text-white">Alterar Senha</h2>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Senha atual</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className={inputClass} style={inputStyle} placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nova senha</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} className={inputClass} style={inputStyle} placeholder="Mínimo 6 caracteres" />
          </div>
          {passwordMsg && <p className={`text-sm ${passwordMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{passwordMsg}</p>}
          <button type="submit" disabled={savingPassword} className="px-6 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors">
            {savingPassword ? 'Alterando...' : 'Alterar Senha'}
          </button>
        </form>
      </div>

      {/* Salário Mínimo */}
      <div className={cardClass} style={cardStyle}>
        <h2 className="text-lg font-semibold text-white">Salário Mínimo de Referência</h2>
        <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
          <p className="text-sm text-violet-300">
            💡 O SM é usado como referência para metas de renda passiva. Mantenha-o atualizado para que as metas permaneçam relevantes ao longo do tempo (ex: "3× SM" sempre reflete o custo de vida atual).
          </p>
        </div>
        <form onSubmit={handleWageSave} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Valor atual (R$)</label>
            <input type="number" step="0.01" min="1" value={minimumWage} onChange={e => setMinimumWage(e.target.value)} className={inputClass} style={inputStyle} placeholder="1412.00" />
            {wageUpdatedAt && (
              <p className="text-xs text-gray-600 mt-1">
                Atualizado em {new Date(wageUpdatedAt).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
          {wageMsg && <p className={`text-sm ${wageMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{wageMsg}</p>}
          <button type="submit" disabled={savingWage} className="px-6 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors">
            {savingWage ? 'Atualizando...' : 'Atualizar Salário Mínimo'}
          </button>
        </form>
      </div>
    </div>
  )
}
