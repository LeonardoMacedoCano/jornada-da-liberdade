import { Router } from 'express'
import { getProfile, updateProgress, updateSettings } from '../controllers/userController'
import { authMiddleware } from '../middleware/auth'
import { asyncHandler } from '../lib/asyncHandler'

export const userRouter = Router()

userRouter.use(authMiddleware)
userRouter.get('/profile', asyncHandler(getProfile))
userRouter.put('/progress', asyncHandler(updateProgress))
userRouter.put('/settings', asyncHandler(updateSettings))
