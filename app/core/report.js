const reportSQL = require("../db/sql/report");

async function getEntityCountForTrackSilos(params) {
  return reportSQL.getEntityCountForTrackSilos(params);
}

async function getVisitedTrackSilosForEntity(params) {
  return reportSQL.getVisitedTrackSilosForEntity(params);
}

module.exports = {
  getEntityCountForTrackSilos,
  getVisitedTrackSilosForEntity
};
