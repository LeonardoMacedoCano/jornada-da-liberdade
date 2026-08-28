import { Router } from 'express'
import { getAuthConfig, googleAuth, me } from '../controllers/authController'
import { authMiddleware } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { asyncHandler } from '../lib/asyncHandler'
import { googleAuthSchema } from '../lib/schemas'

export const authRouter = Router()

authRouter.get('/config', asyncHandler(getAuthConfig))
authRouter.post('/google', validateBody(googleAuthSchema), asyncHandler(googleAuth))
authRouter.get('/me', authMiddleware, asyncHandler(me))
