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
  console.log(res1)
  console.log(res2)
  return { data: 'foo' }
}

module.exports = {
  getEntityCountForTrackSilos,
  getVisitedTrackSilosForEntity,
  getEntitiesForSilo
};
