const trackStatusSQL = require('../db/sql/trackStatus');

async function getStatus() {
  return trackStatusSQL.getStatus();
}

module.exports = { getStatus };
