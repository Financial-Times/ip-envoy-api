const trackSQL = require('../db/sql/track')
const trackRevSQL = require('../db/sql/trackRev')

// const siloSQL = require('../db/sql/silo')
// const entitySQL = require('../db/sql/entity')
// const handleError = require('../utils/handleError')

/*
async function start(trackId) {
  // TODO Let's rethink this - need to run a volt query and use existing entity
  // functionality to add new entities and add to silo.
  const trackState = await trackSQL.getState(trackId) // track is in the correct state
  if (trackState.trackStatusId !== 1) {
    return handleError(`Track is not in pending state, it is currently ${trackState.trackStatusName}
    so cannot be started`, 1)
  }
  const { voltQuery, entityTypeName } = await trackSQL.getTrack(trackId)
  if (!voltQuery) {
    return handleError('No voltSQL defined or no stored proceedure specified', 2)
  }
  const entityIds = await entitySQL.createFromVolt(voltQuery, entityTypeName)
  await trackSQL.setState(trackId, 2) // set track to state primed
  // add newly created entities to first (source) silo
  // TODO change to placeInSourceSilo
  await siloSQL.addToFirst({ trackId, entityTypeName }, entityIds)
  return false
}
*/

async function start(trackId) {
  // just set track state to live, queues have been added since this was first written and Entities
  // can now be placed into a source silo if the conditions are correct
  // TODO: Could expand the API to set track to any status level. Will make it far more useful
  await trackSQL.setState(trackId, 3) // set track to state live
  return false
}

async function saveTrack(trackData) {
  const { newTrack } = trackData
  try {
    const savedTrackRes = await trackSQL.add({ ...newTrack, entityTypeName: 'user' })
    await trackSQL.addTrackRev(savedTrackRes.trackId, newTrack.isActive)
    const res = await trackRevSQL.getByTrackId(savedTrackRes.trackId)
    return res[0]
  } catch (e) {
    throw e
  }
}

async function updateTrack(trackId, name, descr, statusId) {
  return trackSQL.updateTrack(trackId, name, descr, statusId)
    .then((updatedTrack) => updatedTrack)
    .catch((error) => error)
}

module.exports = {
  start,

  // TODO: add a wrapper function for these 3 functions.
  // queryLatestRevision: trackSQL.queryLatestRevision,
  // setCurrentRevById: trackSQL.setCurrentRevById,
  list: trackSQL.list,
  // getById: trackSQL.getById,
  saveTrack,
  updateTrack
}
