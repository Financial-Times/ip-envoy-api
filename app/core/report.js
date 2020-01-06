const reportSQL = require("../db/sql/report");

async function getEntityCountForTrackSilos(params) {
  return reportSQL.getEntityCountForTrackSilos(params);
}

async function getVisitedTrackSilosForEntity(params) {
  return reportSQL.getVisitedTrackSilosForEntity(params);
}

async function getEntitiesForSilo(params) {
  const res1 = await reportSQL.getEntitiesForSiloCount(params);
  const res2 = await reportSQL.getEntitiesForSilo(params);
  return { count: res1, rows: res2 };
}

async function getEntityCountForJourneySilos(params) {
  return reportSQL.getEntityCountForJourneySilos(params);
}

async function getVisitedJourneySilosForEntity(params) {
  // SD todo
}

async function getEntitiesInSilo(params) {
  // SD todo
}

module.exports = {
  getEntityCountForTrackSilos, // the first three of these can be removed after we migrate to v2
  getVisitedTrackSilosForEntity,
  getEntitiesForSilo,
  getEntityCountForJourneySilos, // the "track" ones can be removed after we migrate to v2
  getVisitedJourneySilosForEntity,
  getEntitiesInSilo
};
