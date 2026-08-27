import { Router } from 'express'
import { getProfile, updateProgress, updateSettings } from '../controllers/userController'
import { authMiddleware } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { asyncHandler } from '../lib/asyncHandler'
import { updateProgressSchema, updateSettingsSchema } from '../lib/schemas'

export const userRouter = Router()

userRouter.use(authMiddleware)
userRouter.get('/profile', asyncHandler(getProfile))
userRouter.put('/progress', validateBody(updateProgressSchema), asyncHandler(updateProgress))
userRouter.put('/settings', validateBody(updateSettingsSchema), asyncHandler(updateSettings))
