const entitySQL = require("../db/sql/entity");

async function deleteFromTrack(params) {
  return entitySQL.deleteFromTrack(params);
}

async function deleteFromJourney(params) {
  return entitySQL.deleteFromJourney(params);
}

module.exports = {
  deleteFromTrack, // this one can go once we move to v2
  deleteFromJourney
};
