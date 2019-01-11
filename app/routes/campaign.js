import express from 'express'

import { campaign } from '../controllers/campaign'

const router = express.Router()

export default function(app) {
  // list all campaigns
  router.route('/').get(campaign)
  app.use('/campaign', router)
}
