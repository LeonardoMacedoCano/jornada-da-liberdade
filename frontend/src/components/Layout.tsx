import styled from 'styled-components'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useThemeControl } from '../contexts/ThemeControlContext'

const Nav = styled.nav`
  background: ${p => p.theme.colors.secondary};
  border-bottom: 1px solid ${p => p.theme.colors.tertiary};
  padding: 12px 24px;
`

const NavInner = styled.div`
  max-width: 1152px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const BrandName = styled.span`
  color: ${p => p.theme.colors.white};
  font-weight: 700;
  font-size: 18px;

  @media (max-width: 640px) { display: none; }
`

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const StyledNavLink = styled(NavLink)`
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  text-decoration: none;
  color: ${p => p.theme.colors.gray};
  transition: all 0.15s;

  &:hover {
    color: ${p => p.theme.colors.white};
    background: ${p => p.theme.colors.white}0d;
  }

  &.active {
    background: ${p => p.theme.colors.quaternary};
    color: ${p => p.theme.colors.white};
  }
`

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const UserNavLink = styled(NavLink)`
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  text-decoration: none;
  color: ${p => p.theme.colors.gray};
  transition: color 0.15s;

  &.active { color: ${p => p.theme.colors.quaternary}; }
  &:hover { color: ${p => p.theme.colors.white}; }

  .icon { display: none; }

  @media (max-width: 640px) {
    .name { display: none; }
    .icon { display: inline; }
  }
`

const LogoutButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  background: transparent;
  border: none;
  color: ${p => p.theme.colors.gray};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    color: ${p => p.theme.colors.white};
    background: ${p => p.theme.colors.white}0d;
  }
`

const ThemeToggleButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 16px;
  background: transparent;
  border: none;
  color: ${p => p.theme.colors.gray};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    color: ${p => p.theme.colors.white};
    background: ${p => p.theme.colors.white}0d;
  }
`

const Main = styled.main`
  max-width: 1152px;
  margin: 0 auto;
  padding: 24px 16px;
`

export default function Layout() {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mode, toggleMode } = useThemeControl()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav>
        <NavInner>
          <Brand>
            <span style={{ fontSize: 22 }}>💎</span>
            <BrandName>{t('common.appName')}</BrandName>
          </Brand>
          <NavLinks>
            <StyledNavLink to="/" end>{t('nav.dashboard')}</StyledNavLink>
            <StyledNavLink to="/roadmap">{t('nav.roadmap')}</StyledNavLink>
            <StyledNavLink to="/history">{t('nav.history')}</StyledNavLink>
          </NavLinks>
          <NavActions>
            <ThemeToggleButton
              type="button"
              onClick={toggleMode}
              aria-label={mode === 'dark' ? t('nav.switchToLight') : t('nav.switchToDark')}
              title={mode === 'dark' ? t('nav.switchToLight') : t('nav.switchToDark')}
            >
              <span aria-hidden="true">{mode === 'dark' ? '☀️' : '🌙'}</span>
            </ThemeToggleButton>
            <UserNavLink to="/settings" aria-label={t('settings.title')}>
              <span className="name">{user?.name}</span>
              <span className="icon" aria-hidden="true">⚙️</span>
            </UserNavLink>
            <LogoutButton onClick={handleLogout}>{t('nav.logout')}</LogoutButton>
          </NavActions>
        </NavInner>
      </Nav>
      <Main>
        <Outlet />
      </Main>
    </div>
  )
}
