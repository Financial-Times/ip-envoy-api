const actionSQL = require("../db/sql/action");

async function list(params) {
  return actionSQL.list(params);
}

module.exports = {
  list
};
