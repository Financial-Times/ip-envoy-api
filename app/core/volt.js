const volt = require('../rulesEngine/data');

async function get(entityId, procName) {
  return volt.fetch(procName, [entityId]);
}

module.exports = {
  get
};
