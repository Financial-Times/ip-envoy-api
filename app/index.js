import 'babel-polyfill'
import express from 'express'
import bodyParser from 'body-parser'

import  logger from './logger'

// import routes.
import trackRoute from './routes/track'
import trackRevRoute from './routes/trackRev'
import listTrackRoute from './routes/listTrack'
import entityRoute from './routes/entity'
import deleteTrackRoute from './routes/deleteTrack'
import saveTrackRoute from './routes/saveTrack'
import campaignRoute from './routes/campaign'
import trackStatusRoute from './routes/trackStatus'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
  // TODO: just for dev
  return next()
  const header = req.get('x-api-key')
  if (!header || header !== config.envoyApiKey) {
    return res.status(401).send('Unauthorized request')
  }
  return next()
})

// Set routes.
trackRoute(app)
trackRevRoute(app)
entityRoute(app)
listTrackRoute(app)
deleteTrackRoute(app)
saveTrackRoute(app)
campaignRoute(app)
trackStatusRoute(app)

// Handle global uncaught async errors.
process.on('uncaughtException', err =>
  logger.error('global exception:', err.message))

// Handle unhandled global rejected promises.
// This will catch any unexpected exceptions inside `async` functions.
process.on('unhandledRejection', (reason, promise) =>
  logger.error('unhandled promise rejection:', reason.message || reason))

const port = process.env.PORT
app.listen(port, err => {
  if (err) throw err
  logger.info(`Server started on port ${port}`)
})


