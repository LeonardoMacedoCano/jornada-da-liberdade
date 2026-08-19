import { prisma } from './prisma'
import { MINIMUM_WAGE, MINIMUM_WAGE_USD } from './constants'

export async function getUserLanguage(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { language: true } })
  return user?.language ?? 'pt-BR'
}

export function minimumWageFor(language: string): number {
  return language === 'en' ? MINIMUM_WAGE_USD : MINIMUM_WAGE
}
