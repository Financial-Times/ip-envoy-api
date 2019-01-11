const entitySQL = require('../db/sql/entity');
const channelSQL = require('../db/sql/channel');

async function get(entityId) {
  return entitySQL.get(entityId);
}

async function getMany(entityId) {
  return entitySQL.getMany(entityId);
}

async function have(entityId, entityTypeName) {
  return entitySQL.add(entityId, entityTypeName);
}

async function haveMany(entities) {
  return entitySQL.addMany(entities);
}

async function moveBatchToSilo(batches) {
  /* re-mangle all moveTo batches data, into groups for db processing.
  We want all entities moving from the same Silo, to the same Silo to move in one SQL statement
  with a specifically crafted WHEREIN clause. All others groups can then be wrapped into a
  transaction. This should give major performance gains. */
  const batchesOpt = {};
  batches.forEach((batch) => {
    const { entities, entityTypeName, onPassSiloId, onFailSiloId, currentSiloId, stepId } = batch;
    const curSiloId = currentSiloId || 'none';
    if (!(curSiloId in batchesOpt)) {
      batchesOpt[curSiloId] = {};
    }
    if (!(entityTypeName in batchesOpt[curSiloId])) {
      batchesOpt[curSiloId][entityTypeName] = { pass: {}, fail: {} };
    }
    if (!(onPassSiloId in batchesOpt[curSiloId][entityTypeName].pass)) {
      // batchesOpt[curSiloId][entityTypeName].pass[onPassSiloId] = [];
      batchesOpt[curSiloId][entityTypeName].pass[onPassSiloId] =
        { entities: [], lastStepId: stepId };
    }
    if (!(onFailSiloId in batchesOpt[curSiloId][entityTypeName].fail)) {
      // batchesOpt[curSiloId][entityTypeName].fail[onFailSiloId] = [];
      batchesOpt[curSiloId][entityTypeName].fail[onFailSiloId] =
        { entities: [], lastStepId: stepId };
    }
    batchesOpt[curSiloId][entityTypeName].pass[onPassSiloId].entities.push(
      ...Object.keys(entities).filter((e) => entities[e].mode === 'pass')
    );
    batchesOpt[curSiloId][entityTypeName].fail[onFailSiloId].entities.push(
      ...Object.keys(entities).filter((e) => entities[e].mode === 'fail')
    );
  });
  const res = await entitySQL.moveBatchToSilo(batchesOpt);
  return res;
}

async function getEntitySilos(params) {
  return entitySQL.findContainingSilos(params);
}

// Completely removes an entity from a track - used when entity enters a drain silo
async function flush(entityId, entityTypeName, drainSiloId) {
  await channelSQL.purgeLog(entityId, entityTypeName, drainSiloId);
  await entitySQL.purgeFromDrain(entityId, entityTypeName, drainSiloId);
}

// Completely removes all entities from tracks that have reached a drain silo
async function flushAll() {
  await channelSQL.purgeAllDrainedLogs();
  await entitySQL.purgeFromAllDrains();
}

module.exports = {
  get,
  getMany,
  getTracks: entitySQL.getTracks,
  getTracksByBatch: entitySQL.getTracksByBatch,
  have,
  haveMany,
  moveBatchToSilo,
  getEntitySilos,
  flush,
  flushAll
};
