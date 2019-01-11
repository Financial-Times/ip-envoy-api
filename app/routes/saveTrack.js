import express from 'express'

import { postTrack } from '../controllers/trackSaveControler'

const router = express.Router()

export default function(app) {
  router.route('/').post(postTrack)
  app.use('/saveTrack', router)
}
