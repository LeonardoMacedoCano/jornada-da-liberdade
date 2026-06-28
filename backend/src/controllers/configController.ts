import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { MINIMUM_WAGE } from '../lib/constants'

export async function getMinimumWage(_req: AuthRequest, res: Response): Promise<void> {
  res.json({ value: MINIMUM_WAGE, updatedAt: null })
}
