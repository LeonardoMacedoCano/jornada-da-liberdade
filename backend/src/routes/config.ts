import { Router } from 'express'
import { getMinimumWage } from '../controllers/configController'
import { authMiddleware } from '../middleware/auth'
import { asyncHandler } from '../lib/asyncHandler'

export const configRouter = Router()

configRouter.get('/minimum-wage', authMiddleware, asyncHandler(getMinimumWage))
