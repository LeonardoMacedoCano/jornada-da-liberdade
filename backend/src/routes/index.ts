import { Router } from 'express'
import { authRouter } from './auth'
import { userRouter } from './user'
import { phasesRouter } from './phases'
import { missionsRouter } from './missions'
import { configRouter } from './config'
import { shareRouter } from './share'

export const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/phases', phasesRouter)
router.use('/missions', missionsRouter)
router.use('/config', configRouter)
router.use('/share', shareRouter)
