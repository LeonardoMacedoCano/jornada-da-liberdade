import i18n, { TFunction } from 'i18next'
import { initReactI18next } from 'react-i18next'
import strings from './strings'

export function translateApiError(t: TFunction, data: unknown, fallbackKey: string): string {
  const errorData = data as { error?: string } | undefined
  if (!errorData?.error) return t(fallbackKey)
  return t(`errors.${errorData.error}`, { ...errorData, defaultValue: t(fallbackKey) })
}

i18n
  .use(initReactI18next)
  .init({
    resources: { 'pt-BR': { translation: strings } },
    lng: 'pt-BR',
    fallbackLng: 'pt-BR',
    interpolation: { escapeValue: false },
  })

document.documentElement.lang = 'pt-BR'

export default i18n
