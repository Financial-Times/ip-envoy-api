const siloSQL = require('../db/sql/silo');

// Should be in Silo SQL (get all entities in Silo)
async function getEntitiesBySilo(siloId) {
  return siloSQL.getEntitiesBySilo(siloId);
}

async function entityCount(siloId) {
  return siloSQL.entityCount(siloId);
}
async function activityCount(siloId, minutes) {
  return siloSQL.activityCount(siloId, minutes);
}

async function entityHistory(siloId, entityId) {
  return siloSQL.entityHistory(siloId, entityId);
}

module.exports = {
  getEntitiesBySilo,
  entityCount,
  activityCount,
  entityHistory
};
