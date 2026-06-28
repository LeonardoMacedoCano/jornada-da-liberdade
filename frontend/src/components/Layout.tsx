import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen" style={{ background: '#0f0f1a' }}>
      <nav style={{ background: '#1a1a2e', borderBottom: '1px solid #2d2d4e' }} className="px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💎</span>
            <span className="text-white font-bold text-lg hidden sm:block">Jornada da Liberdade</span>
          </div>
          <div className="flex items-center gap-1">
            <NavLink to="/" end className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
            }>Dashboard</NavLink>
            <NavLink to="/roadmap" className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
            }>Roadmap</NavLink>
            <NavLink to="/history" className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
            }>Histórico</NavLink>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/settings" className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'text-violet-400' : 'text-gray-400 hover:text-white'}`
            }>
              <span className="hidden sm:inline">{user?.name}</span>
              <span className="sm:hidden">⚙️</span>
            </NavLink>
            <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              Sair
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
