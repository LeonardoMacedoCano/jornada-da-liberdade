import { Router } from 'express'
import { getAllPhases, getCurrentPhase } from '../controllers/phaseController'
import { authMiddleware } from '../middleware/auth'
import { asyncHandler } from '../lib/asyncHandler'

export const phasesRouter = Router()

phasesRouter.use(authMiddleware)
phasesRouter.get('/', asyncHandler(getAllPhases))
phasesRouter.get('/current', asyncHandler(getCurrentPhase))
