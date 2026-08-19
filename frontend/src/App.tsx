import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { ToastStack } from 'lcano-react-ui'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'
import History from './pages/History'
import Settings from './pages/Settings'
import PublicProfile from './pages/PublicProfile'
import Layout from './components/Layout'

const FullScreen = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.theme.colors.primary};
`

const LoadingText = styled.div`
  font-size: 20px;
  color: ${p => p.theme.colors.quaternary};
  animation: fadeIn 0.6s ease-out infinite alternate;
`

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const { t } = useTranslation()
  if (loading) return (
    <FullScreen>
      <LoadingText>{t('common.loading')}</LoadingText>
    </FullScreen>
  )
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return !user ? <>{children}</> : <Navigate to="/" replace />
}

function AchievementToastStack() {
  const navigate = useNavigate()
  return (
    <ToastStack
      locale="pt"
      onItemClick={() => navigate('/history')}
    />
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AchievementToastStack />
        <Routes>
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<Navigate to="/login" replace />} />
          <Route path="/p/:username" element={<PublicProfile />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="roadmap" element={<Roadmap />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
