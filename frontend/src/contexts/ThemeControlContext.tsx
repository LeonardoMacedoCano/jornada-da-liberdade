import { createContext, useContext, useState, ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'
import { AppTheme } from 'lcano-react-ui'

export type ThemeMode = 'dark' | 'light'

const STORAGE_KEY = 'themeMode'

function resolveInitialMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

interface ThemeControlContextProps {
  theme: AppTheme
  mode: ThemeMode
  toggleMode: () => void
}

const ThemeControlContext = createContext<ThemeControlContextProps | null>(null)

interface ThemeControlProviderProps {
  darkTheme: AppTheme
  lightTheme: AppTheme
  children: ReactNode
}

export function ThemeControlProvider({ darkTheme, lightTheme, children }: ThemeControlProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(resolveInitialMode)
  const theme = mode === 'light' ? lightTheme : darkTheme

  function toggleMode() {
    setMode(current => {
      const next = current === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }

  return (
    <ThemeControlContext.Provider value={{ theme, mode, toggleMode }}>
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
