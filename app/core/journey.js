const journeySQL = require("../db/sql/journey");

async function list(entityType) {
  return journeySQL.list(entityType);
}

async function getById(journeyId,entityType) {
  return journeySQL.getById(journeyId,entityType);
}

async function getLast(entityType) {
  return journeySQL.getLast(entityType);
}

async function updateJourney(journeyId, descr, journeyStatusId, entityType) {
  return journeySQL.updateJourney(journeyId, descr, journeyStatusId, entityType);
}

module.exports = {
  list,
  getById,
  getLast,
  updateJourney
};
