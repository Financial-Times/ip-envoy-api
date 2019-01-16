const express = require("express");

// const trackRoute = require('./routes/track')
// const trackRevRoute = require('./routes/trackRev')
const listTrackRoute = require('./listTrack')
// const entityRoute = require('./routes/entity')
// const deleteTrackRoute = require('./routes/deleteTrack')
// const saveTrackRoute = require('./routes/saveTrack')
// const campaignRoute = require('./routes/campaign')
// const trackStatusRoute = require('./routes/trackStatus')

// Top level router.
const router = express.Router();

// Resource specific routers.
router.use('/listTrack', listTrackRoute)

module.exports = router;