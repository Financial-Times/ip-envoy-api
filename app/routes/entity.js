import express from 'express'

import { getEntityById } from '../controllers/entityController'

const router = express.Router()

export default function(app) {
  router.route('/:entityId').get(getEntityById)
  app.use('/entity', router)
}
