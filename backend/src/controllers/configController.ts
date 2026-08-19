import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { getMinimumWage as fetchMinimumWage } from '../lib/appConfig'

export async function getMinimumWage(_req: AuthRequest, res: Response): Promise<void> {
  const { value, updatedAt } = await fetchMinimumWage()
  res.json({ value, currency: 'BRL', updatedAt })
}
