import express from 'express'

import { list, getById, postControllers , updateTrack, getLatestRevision } from '../controllers/trackController'

const router = express.Router()

export default function(app) {
  // List all tracks
  router.route('/').get(list)
  // list track by Id
  router.route('/:trackId').get(getById)
  //.post(postControllers)
  .patch(updateTrack)
  // list latest Revision for by trackId
  router.route('/:trackId/latestRevision').get(getLatestRevision)
  app.use('/track', router)
}
