import { Router } from 'express'
import { getMissions, completeMission, startMission, uncompleteMission } from '../controllers/missionController'
import { authMiddleware } from '../middleware/auth'
import { asyncHandler } from '../lib/asyncHandler'

export const missionsRouter = Router()

missionsRouter.use(authMiddleware)
missionsRouter.get('/', asyncHandler(getMissions))
missionsRouter.post('/:id/start', asyncHandler(startMission))
missionsRouter.post('/:id/complete', asyncHandler(completeMission))
missionsRouter.post('/:id/uncomplete', asyncHandler(uncompleteMission))
