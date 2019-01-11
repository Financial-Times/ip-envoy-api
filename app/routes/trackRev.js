import express from 'express'

import cors from '../middleware/cors'
import { patchTrack, deployTrack, getById } from '../controllers/trackRevController'

const router = express.Router()

export default function(app) {
  router
    .use(cors)
    .route('/:trackRevId')
    .patch(patchTrack)
    .post(deployTrack)
    .get(getById) // list track by Id
  app.use('/trackRev', router)
}
