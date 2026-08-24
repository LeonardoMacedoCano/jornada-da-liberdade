import styled from 'styled-components'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { RailTabsNav, type RailTabsNavItem } from 'lcano-react-ui'
import { useAuth } from '../contexts/AuthContext'
import strings from '../i18n/strings'

const RAIL_WIDTH = 76
const TAB_BAR_HEIGHT = 64
const COMPACT_BELOW = '700px'

const NAV_SCREENS: { path: string; icon: string; label: string }[] = [
  { path: '/', icon: '🏠', label: strings.nav.dashboard },
  { path: '/roadmap', icon: '🗺️', label: strings.nav.roadmap },
  { path: '/history', icon: '📜', label: strings.nav.history },
  { path: '/settings', icon: '⚙️', label: strings.nav.settings },
]

const Root = styled.div`
  min-height: 100%;

  @media (min-width: ${COMPACT_BELOW}) {
    padding-left: ${RAIL_WIDTH}px;
  }

  @media (max-width: calc(${COMPACT_BELOW} - 1px)) {
    padding-bottom: ${TAB_BAR_HEIGHT}px;
  }
`

const AccountSlot = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 6px 6px 14px;
  border-radius: 999px;
  background: ${p => p.theme.colors.secondary};
  border: 1px solid ${p => p.theme.colors.tertiary};
`

const UserName = styled.span`
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  color: ${p => p.theme.colors.gray};
`

const LogoutButton = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  color: ${p => p.theme.colors.gray};
  transition: all 0.15s;

  &:hover {
    color: ${p => p.theme.colors.white};
    background: ${p => p.theme.colors.white}0d;
  }
`

const Main = styled.main`
  max-width: 1152px;
  margin: 0 auto;
  padding: 72px 16px 24px;
`

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const items: RailTabsNavItem[] = NAV_SCREENS.map(screen => ({
    id: screen.path,
    icon: screen.icon,
    label: screen.label,
    active: screen.path === '/' ? location.pathname === '/' : location.pathname.startsWith(screen.path),
    onClick: () => navigate(screen.path),
  }))

  return (
    <Root>
      <RailTabsNav items={items} ariaLabel={strings.nav.mainNavigation} />

      <AccountSlot>
        <UserName>{user?.name}</UserName>
        <LogoutButton onClick={handleLogout}>{strings.nav.logout}</LogoutButton>
      </AccountSlot>

      <Main>
        <Outlet />
      </Main>
    </Root>
  )
}
