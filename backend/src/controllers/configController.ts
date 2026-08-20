import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { getMinimumWage as fetchMinimumWage } from '../lib/appConfig'

export async function getMinimumWage(_req: AuthRequest, res: Response): Promise<void> {
  res.json(fetchMinimumWage())
}
