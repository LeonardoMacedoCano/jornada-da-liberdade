import type { AppTheme } from 'lcano-react-ui'
import type { Tema } from 'lcano-react-ui'

// Paletas com contraste WCAG AA validado (texto secundário e de destaque
// ≥ 4.5:1 contra o fundo de página/card em todos os temas escuros).
export const THEMES: Tema[] = [
  {
    id: 0,
    title: 'Meia-Noite',
    primaryColor: '#0f0f1a',
    secondaryColor: '#1a1a2e',
    tertiaryColor: '#2d2d4e',
    quaternaryColor: '#a78bfa',
    whiteColor: '#f8f8f2',
    blackColor: '#000000',
    grayColor: '#9b9db3',
    successColor: '#4ade80',
    infoColor: '#67e8f9',
    warningColor: '#fb923c',
  },
  {
    id: 1,
    title: 'Floresta',
    primaryColor: '#0d1512',
    secondaryColor: '#16221c',
    tertiaryColor: '#24352c',
    quaternaryColor: '#4ade80',
    whiteColor: '#f1f5f2',
    blackColor: '#000000',
    grayColor: '#9aa79f',
    successColor: '#34d399',
    infoColor: '#5eead4',
    warningColor: '#fb923c',
  },
  {
    id: 2,
    title: 'Índigo Noturno',
    primaryColor: '#0a0e1a',
    secondaryColor: '#131a2b',
    tertiaryColor: '#202b45',
    quaternaryColor: '#60a5fa',
    whiteColor: '#f4f6fb',
    blackColor: '#000000',
    grayColor: '#98a2b8',
    successColor: '#4ade80',
    infoColor: '#38bdf8',
    warningColor: '#fbbf24',
  },
  {
    id: 3,
    title: 'Grafite & Ouro',
    primaryColor: '#111214',
    secondaryColor: '#1b1c1f',
    tertiaryColor: '#2e3034',
    quaternaryColor: '#d4a95c',
    whiteColor: '#f2f2f0',
    blackColor: '#000000',
    grayColor: '#a3a5ab',
    successColor: '#4ade80',
    infoColor: '#7dd3fc',
    warningColor: '#fb923c',
  },
  {
    id: 4,
    title: 'Claro',
    primaryColor: '#f7f7fb',
    secondaryColor: '#ffffff',
    tertiaryColor: '#e0e0ea',
    quaternaryColor: '#6d28d9',
    whiteColor: '#18182b',
    blackColor: '#000000',
    grayColor: '#52556b',
    successColor: '#15803d',
    infoColor: '#0e7490',
    warningColor: '#c2410c',
  },
]

export const DEFAULT_THEME_ID = THEMES[0].id

export function temaToAppTheme(tema: Tema): AppTheme {
  return {
    title: tema.title,
    colors: {
      primary: tema.primaryColor,
      secondary: tema.secondaryColor,
      tertiary: tema.tertiaryColor,
      quaternary: tema.quaternaryColor,
      white: tema.whiteColor,
      black: tema.blackColor,
      gray: tema.grayColor,
      success: tema.successColor,
      info: tema.infoColor,
      warning: tema.warningColor,
    },
  }
}
