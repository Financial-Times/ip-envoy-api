import express from 'express'

import { trackStatus } from '../controllers/trackStatus'

const router = express.Router()

export default function(app) {
  // list all track status
  router.route('/').get(trackStatus)
  app.use('/trackStatus', router)
}
