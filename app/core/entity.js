const entitySQL = require("../db/sql/entity");

async function deleteFromTrack(params) {
  return entitySQL.deleteFromTrack(params);
}

module.exports = {
  deleteFromTrack
};
