import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { IconButton } from 'lcano-react-ui'
import { useAuth } from '../contexts/AuthContext'
import strings from '../i18n/strings'

const MOBILE_BREAKPOINT = 700

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
`

const NavLinks = styled.div`
  display: none;
  align-items: center;
  gap: 4px;

  @media (min-width: ${MOBILE_BREAKPOINT}px) {
    display: flex;
  }
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
  display: none;
  align-items: center;
  gap: 8px;

  @media (min-width: ${MOBILE_BREAKPOINT}px) {
    display: flex;
  }
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

const MenuToggle = styled.div`
  display: block;

  @media (min-width: ${MOBILE_BREAKPOINT}px) {
    display: none;
  }
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${p => p.theme.colors.black}99;
  z-index: 29;
`

const Drawer = styled.nav<{ $open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 30;
  width: min(280px, 85vw);
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 16px;
  overflow-y: auto;
  background: ${p => p.theme.colors.secondary};
  border-right: 1px solid ${p => p.theme.colors.tertiary};
  box-shadow: 4px 0 20px ${p => p.theme.colors.black}66;
  transform: translateX(${p => p.$open ? '0' : '-100%'});
  transition: transform 0.25s ease;
`

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const DrawerTitle = styled.span`
  flex: 1;
  font-weight: 700;
  color: ${p => p.theme.colors.white};
`

const DrawerNavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const DrawerNavLink = styled(NavLink)`
  padding: 12px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
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

const DrawerFooter = styled.div`
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid ${p => p.theme.colors.tertiary};
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const DrawerLogoutButton = styled.button`
  text-align: left;
  padding: 12px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
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
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    drawerRef.current?.toggleAttribute('inert', !drawerOpen)
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  function handleLogout() {
    setDrawerOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav>
        <NavInner>
          <Brand>
            <span style={{ fontSize: 22 }}>💎</span>
            <BrandName>{strings.common.appName}</BrandName>
          </Brand>
          <NavLinks>
            <StyledNavLink to="/" end>{strings.nav.dashboard}</StyledNavLink>
            <StyledNavLink to="/roadmap">{strings.nav.roadmap}</StyledNavLink>
            <StyledNavLink to="/history">{strings.nav.history}</StyledNavLink>
          </NavLinks>
          <NavActions>
            <UserNavLink to="/settings" aria-label={strings.settings.title}>
              {user?.name}
            </UserNavLink>
            <LogoutButton onClick={handleLogout}>{strings.nav.logout}</LogoutButton>
          </NavActions>
          <MenuToggle>
            <IconButton icon="☰" label={strings.nav.openMenu} onClick={() => setDrawerOpen(true)} />
          </MenuToggle>
        </NavInner>
      </Nav>

      {drawerOpen && <Overlay onClick={() => setDrawerOpen(false)} />}

      <Drawer ref={drawerRef} $open={drawerOpen}>
        <DrawerHeader>
          <span style={{ fontSize: 22 }}>💎</span>
          <DrawerTitle>{strings.common.appName}</DrawerTitle>
          <IconButton icon="✕" label={strings.nav.closeMenu} onClick={() => setDrawerOpen(false)} />
        </DrawerHeader>

        <DrawerNavList>
          <DrawerNavLink to="/" end onClick={() => setDrawerOpen(false)}>{strings.nav.dashboard}</DrawerNavLink>
          <DrawerNavLink to="/roadmap" onClick={() => setDrawerOpen(false)}>{strings.nav.roadmap}</DrawerNavLink>
          <DrawerNavLink to="/history" onClick={() => setDrawerOpen(false)}>{strings.nav.history}</DrawerNavLink>
        </DrawerNavList>

        <DrawerFooter>
          <DrawerNavLink to="/settings" onClick={() => setDrawerOpen(false)}>
            {strings.settings.title} — {user?.name}
          </DrawerNavLink>
          <DrawerLogoutButton onClick={handleLogout}>{strings.nav.logout}</DrawerLogoutButton>
        </DrawerFooter>
      </Drawer>

      <Main>
        <Outlet />
      </Main>
    </div>
  )
}
