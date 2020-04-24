const stepSQL = require("../db/sql/step");

async function list(entityType) {
  return stepSQL.list(entityType);
}

module.exports = {
  list
};
