import { prisma } from './prisma'

export async function getMinimumWage(): Promise<{ value: number; updatedAt: string | null }> {
  const [wage, updatedAt] = await Promise.all([
    prisma.appConfig.findUnique({ where: { key: 'minimum_wage' } }),
    prisma.appConfig.findUnique({ where: { key: 'minimum_wage_updated_at' } }),
  ])

  return {
    value: parseFloat(wage!.value),
    updatedAt: updatedAt?.value ?? null,
  }
}
