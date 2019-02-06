const reportSQL = require("../db/sql/report");

async function getTrack(params) {
  return reportSQL.getTrack(params);
}

module.exports = {
  getTrack
};
