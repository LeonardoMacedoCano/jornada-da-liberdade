import { Router } from 'express'
import { register, login, me } from '../controllers/authController'
import { authMiddleware } from '../middleware/auth'
import { asyncHandler } from '../lib/asyncHandler'

export const authRouter = Router()

authRouter.post('/register', asyncHandler(register))
authRouter.post('/login', asyncHandler(login))
authRouter.get('/me', authMiddleware, asyncHandler(me))
