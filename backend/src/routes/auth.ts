import { Router } from 'express'
import { getAuthConfig, googleAuth, me } from '../controllers/authController'
import { authMiddleware } from '../middleware/auth'
import { asyncHandler } from '../lib/asyncHandler'

export const authRouter = Router()

authRouter.get('/config', asyncHandler(getAuthConfig))
authRouter.post('/google', asyncHandler(googleAuth))
authRouter.get('/me', authMiddleware, asyncHandler(me))
