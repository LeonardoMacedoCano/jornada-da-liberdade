import i18n, { TFunction } from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import ptBR from './locales/pt-BR'

export const SUPPORTED_LANGUAGES = ['en', 'pt-BR'] as const
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]
export const DEFAULT_LANGUAGE: SupportedLanguage = 'pt-BR'

export function toLibLocale(language: string): 'pt' | 'en' {
  return language.startsWith('pt') ? 'pt' : 'en'
}

export function currencySymbol(language: string): string {
  return language.startsWith('pt') ? 'R$' : '$'
}

export function translateApiError(t: TFunction, data: unknown, fallbackKey: string): string {
  const errorData = data as { error?: string } | undefined
  if (!errorData?.error) return t(fallbackKey)
  return t(`errors.${errorData.error}`, { ...errorData, defaultValue: t(fallbackKey) })
}

const storedLanguage = localStorage.getItem('language')
const initialLanguage = SUPPORTED_LANGUAGES.includes(storedLanguage as SupportedLanguage)
  ? (storedLanguage as SupportedLanguage)
  : DEFAULT_LANGUAGE

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      'pt-BR': { translation: ptBR },
    },
    lng: initialLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
  })

document.documentElement.lang = initialLanguage
i18n.on('languageChanged', lng => { document.documentElement.lang = lng })

export default i18n
