import { createContext, useContext, useState, ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'
import { AppTheme } from 'lcano-react-ui'

interface ThemeControlContextProps {
  theme: AppTheme
  setTheme: (theme: AppTheme) => void
}

const ThemeControlContext = createContext<ThemeControlContextProps | null>(null)

interface ThemeControlProviderProps {
  defaultTheme: AppTheme
  children: ReactNode
}

export function ThemeControlProvider({ defaultTheme, children }: ThemeControlProviderProps) {
  const [theme, setTheme] = useState<AppTheme>(defaultTheme)
  return (
    <ThemeControlContext.Provider value={{ theme, setTheme }}>
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
