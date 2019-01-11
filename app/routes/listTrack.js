import express from 'express'

import { listTrack } from '../controllers/listTrackController'

const router = express.Router()

export default function(app) {
  // list all tracks
  router.route('/').get(listTrack)
  app.use('/listTrack', router)
}
