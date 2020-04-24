const siloSQL = require("../db/sql/silo");

async function list(params) {
  return siloSQL.list(params);
}

module.exports = {
  list
};
