import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { getUserLanguage, minimumWageFor } from '../lib/localization'

export async function getMinimumWage(req: AuthRequest, res: Response): Promise<void> {
  const language = await getUserLanguage(req.userId!)
  res.json({
    value: minimumWageFor(language),
    currency: language === 'en' ? 'USD' : 'BRL',
    updatedAt: null,
  })
}
