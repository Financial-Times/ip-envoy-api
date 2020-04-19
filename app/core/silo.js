const siloSQL = require("../db/sql/silo");

async function list(entityType) {
  return siloSQL.list(entityType);
}

module.exports = {
  list
};
