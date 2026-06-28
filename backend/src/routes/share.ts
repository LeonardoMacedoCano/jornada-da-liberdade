import { Router } from 'express'
import { getPublicProfile } from '../controllers/shareController'
import { asyncHandler } from '../lib/asyncHandler'

export const shareRouter = Router()

shareRouter.get('/:username', asyncHandler(getPublicProfile))
