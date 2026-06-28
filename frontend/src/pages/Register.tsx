import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!/^[a-z0-9-]+$/.test(username)) {
      setError('Username deve conter apenas letras minúsculas, números e hífens')
      return
    }
    setLoading(true)
    try {
      await register(name, email, password, username)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0f0f1a' }}>
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌱</div>
          <h1 className="text-2xl font-bold text-white">Começar a Jornada</h1>
          <p className="text-gray-500 mt-2">Crie sua conta e comece na Fase 0</p>
        </div>
        <div className="rounded-2xl p-8" style={{ background: '#1a1a2e', border: '1px solid #2d2d4e' }}>
          <h2 className="text-xl font-semibold text-white mb-6">Criar conta</h2>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nome</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)} required
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                style={{ background: '#0f0f1a', border: '1px solid #2d2d4e' }}
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Username <span className="text-gray-600">(perfil público)</span></label>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value.toLowerCase())} required
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                style={{ background: '#0f0f1a', border: '1px solid #2d2d4e' }}
                placeholder="joao-silva"
              />
              <p className="text-xs text-gray-600 mt-1">Apenas minúsculas, números e hífens. Ex: joao-silva</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">E-mail</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                style={{ background: '#0f0f1a', border: '1px solid #2d2d4e' }}
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Senha</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                style={{ background: '#0f0f1a', border: '1px solid #2d2d4e' }}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold transition-colors"
            >
              {loading ? 'Criando conta...' : 'Iniciar Jornada'}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
