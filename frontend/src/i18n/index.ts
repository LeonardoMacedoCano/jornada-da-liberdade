import strings from './strings'

export function interpolate(template: string, vars?: Record<string, unknown>): string {
  if (!vars) return template
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => (key in vars ? String(vars[key]) : match))
}

export function translateApiError(data: unknown, fallback: string): string {
  const code = (data as { error?: string } | undefined)?.error
  const template = code ? (strings.errors as Record<string, string>)[code] : undefined
  return template ? interpolate(template, data as Record<string, unknown>) : fallback
}

document.documentElement.lang = 'pt-BR'
