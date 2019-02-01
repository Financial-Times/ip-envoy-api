const trackSQL = require("../db/sql/track");

async function list(entityType) {
  return trackSQL.list(entityType);
}

async function getById(trackId) {
  return trackSQL.getById(trackId);
}

async function getLast(entityType) {
  return trackSQL.getLast(entityType);
}

async function updateTrack(trackId, name, descr, trackStatusId, entityType) {
  return trackSQL.updateTrack(trackId, name, descr, trackStatusId, entityType);
}

module.exports = {
  list,
  getById,
  getLast,
  updateTrack
};
