const DEFAULT_MINIMUM_WAGE = 1621.00

const rawMinimumWage = process.env.MINIMUM_WAGE
const parsedMinimumWage = rawMinimumWage !== undefined ? Number(rawMinimumWage) : NaN
const isValid = Number.isFinite(parsedMinimumWage) && parsedMinimumWage > 0

if (!isValid) {
  console.warn(
    `⚠️  MINIMUM_WAGE não definida ou inválida ("${rawMinimumWage ?? ''}") — usando valor padrão de R$ ${DEFAULT_MINIMUM_WAGE.toFixed(2)}. ` +
    `Defina no .env, ex: MINIMUM_WAGE=1621.00 (formato decimal com ponto e 2 casas para os centavos).`
  )
}

const MINIMUM_WAGE_VALUE = isValid ? parsedMinimumWage : DEFAULT_MINIMUM_WAGE

export function getMinimumWage(): { value: number; currency: 'BRL' } {
  return { value: MINIMUM_WAGE_VALUE, currency: 'BRL' }
}
