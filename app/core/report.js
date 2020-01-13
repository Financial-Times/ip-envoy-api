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


module.exports = {
  getEntityCountForTrackSilos, // can be removed after we migrate to v2
  getVisitedTrackSilosForEntity, // not used?
  getEntitiesForSilo, // not used?
  getEntityCountForJourneySilos
};
