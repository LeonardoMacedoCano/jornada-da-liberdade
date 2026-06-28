import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0f0f1a' }}>
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💎</div>
          <h1 className="text-2xl font-bold text-white">Jornada da Liberdade</h1>
          <p className="text-gray-500 mt-2">Sua jornada rumo à independência financeira</p>
        </div>
        <div className="rounded-2xl p-8" style={{ background: '#1a1a2e', border: '1px solid #2d2d4e' }}>
          <h2 className="text-xl font-semibold text-white mb-6">Entrar</h2>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                style={{ background: '#0f0f1a', border: '1px solid #2d2d4e' }}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold transition-colors"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            Não tem conta?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300">Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
