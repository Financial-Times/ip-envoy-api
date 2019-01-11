const stepSQL = require('../db/sql/step');

// Should be in Silo SQL (get all entities in Silo)
async function getStepsBySilo(siloId) {
  return stepSQL.getBySilo(siloId);
}

async function getAllScheduled(statuses) {
  return stepSQL.getAllScheduled(statuses);
}

async function getAllStarting() {
  return stepSQL.getAllStarting([2, 3]);
}

async function getAllMonitoring(siloIds) {
  return stepSQL.getAllMonitoring(siloIds);
}

async function findStuckEntities(siloIds) {
  return stepSQL.findStuckEntities(siloIds);
}

module.exports = {
  getStepsBySilo,
  getAllScheduled,
  getAllStarting,
  getAllMonitoring,
  findStuckEntities
};
