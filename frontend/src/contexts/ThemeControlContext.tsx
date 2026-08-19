import { createContext, useContext, useState, ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'
import type { AppTheme } from 'lcano-react-ui'
import { THEMES, DEFAULT_THEME_ID, temaToAppTheme } from '../theme'

const STORAGE_KEY = 'themeId'

function resolveInitialThemeId(): number {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null) return DEFAULT_THEME_ID
  const stored = Number(raw)
  return THEMES.some(t => t.id === stored) ? stored : DEFAULT_THEME_ID
}

interface ThemeControlContextProps {
  theme: AppTheme
  themeId: number
  setThemeId: (id: number) => void
}

const ThemeControlContext = createContext<ThemeControlContextProps | null>(null)

export function ThemeControlProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<number>(resolveInitialThemeId)
  const tema = THEMES.find(t => t.id === themeId) ?? THEMES[0]
  const theme = temaToAppTheme(tema)

  function setThemeId(id: number) {
    localStorage.setItem(STORAGE_KEY, String(id))
    setThemeIdState(id)
  }

  return (
    <ThemeControlContext.Provider value={{ theme, themeId, setThemeId }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeControlContext.Provider>
  )
}

export function useThemeControl() {
  const ctx = useContext(ThemeControlContext)
  if (!ctx) throw new Error('useThemeControl must be used within ThemeControlProvider')
  return ctx
}
