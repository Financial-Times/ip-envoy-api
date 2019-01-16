const knex = require('../../db/connect')

const options = {
  columns: [
    'track.name',
    'track.descr',
    'trackRev.isActive',
    'trackRev.created',
    'trackRev.trackRevId',
    'track.trackId',
    'trackStatus.name as status',
    'trackStatus.trackStatusId as statusId'
  ]
}

const getTracksQueryBuilder = ({ columns, trackRevId, trackId }) => {
  const query = knex.select(columns)
    .from('core.track')
    .innerJoin('core.trackRev', 'trackRev.trackId', 'track.trackId')
    .leftJoin('core.trackStatus', 'trackStatus.trackStatusId', 'track.trackStatusId')
    .whereNull('track.deleted')
    .whereNull('trackRev.deleted');
  if (trackRevId) query.where({ 'trackRev.trackRevId': trackRevId })
  if (trackId) query.where({ 'track.trackId': trackId })
  return query
}

async function getById(trackRevId) {
  return getTracksQueryBuilder({ columns: options.columns, trackRevId })
}

async function getByTrackId(trackId) {
  return getTracksQueryBuilder({ columns: options.columns, trackId })
}

async function listTrack() {
  return getTracksQueryBuilder({ columns: options.columns })
}

async function saveTrack(trackId, GUIData) {
  return knex('core.trackRev')
    .returning('*')
    .where('trackId', '=', trackId)
    .update({
      GUIData
    })
}

async function updateTrackName(trackId, name) {
  return knex('core.track')
    .where('trackId', '=', trackId)
    .update({
      name
    })
}

async function updateTrackRemoveDate(date, tableName, column, trackId) {
  return knex(`core.${tableName}`)
    .where(column, '=', trackId) // it should work for track and trackRev table
    .update({
      deleted: date
    })
}

module.exports = {
  getById,
  getByTrackId,
  saveTrack,
  updateTrackName,
  listTrack,
  updateTrackRemoveDate
}
