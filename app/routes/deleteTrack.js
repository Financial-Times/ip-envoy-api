import express from 'express'

import cors from '../middleware/cors'
import { patchTrackToDelete } from '../controllers/trackRevController'

const router = express.Router()

export default function(app) {
  // trackId = trackId or trackRevId
  router.use(cors).route('/:trackId').patch(patchTrackToDelete)
  app.use('/deleteTrack', router)
}
