import express from 'express'

import { getTypes, get } from '../controllers/channelController'

const router = express.Router()

export default function(app) {
  router.route('/types').get(getTypes)
  router.route('/').get(get)
  app.use('/channel', router)
}
