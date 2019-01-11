const rulesEngine = require('../rulesEngine');
const { logger } = require('../logger');
const volt = require('./volt');
const silo = require('./silo');
const memoize = require('memoizee');
const selectn = require('selectn');
const { disableVoltDB } = require('../../config');

function mapEntities(entities) {
  const entityMap = {};
  entities.forEach((entity) => {
    entityMap[entity.entityId] = entity;
  });

  return entityMap;
}

function transformEntitiesOutput(entities, step) {
  const mappedEntities = mapEntities(entities);
  return Object.assign(
    {},
    step,
    { entityIds: Object.keys(mappedEntities) },
    { entities: mappedEntities },
    { entityTypeName: entities[0].entityTypeName }
  );
}

const entityCount = memoize(silo.entityCount, { maxAge: 200 });
const activityCount = memoize(silo.activityCount, { maxAge: 200 });
const entityHistory = memoize(silo.entityHistory, { maxAge: 200 });

async function runRuleSet(step, entities) {
  const re = rulesEngine.engines[step.stepId];
  if (!re) {
    throw new Error(`Ruleset step ${step.stepId} Missing`);
  }
  const processor = async function (entityData) {
    const voltData = {};
    if ((step.voltQuery) && (!disableVoltDB)) {
      const deviceId = selectn('.currentData.spoorId', entityData) ||
        selectn('.currentData.headers.spoor-device-id', entityData);
      const key = step.voltQueryKey === 'deviceId' ? deviceId : entityData.entityId;
      voltData[step.voltQuery] = await volt.get(key, step.voltQuery);
    }
    if ((step.voltQuery) && (disableVoltDB)) logger.warn('Volt would have been called but has been disabled in config');

    let dataToAssess = {
      entityData,
      voltData,
      step
    };
    const monitorSiloId = (selectn('.ruleSetParams.monitorSiloId', step));
    if (monitorSiloId) {
      // const [{ count }] = await entityCount(monitorSiloId);
      // dataToAssess = Object.assign(dataToAssess, { entityCount: count });
      dataToAssess = Object.assign(dataToAssess, { entityCount: 0 });

      const history = await entityHistory(monitorSiloId, entityData.entityId);
      dataToAssess = Object.assign(dataToAssess, { entityHistory: history });

      const minute = (selectn('.ruleSetParams.minute', step));
      if (minute) { // decorate with entity rate since given time
        // const [{ rate }] = await silo.activityCount(monitorSiloId, minute);
        const [{ rate }] = await activityCount(monitorSiloId, minute);
        dataToAssess = Object.assign(dataToAssess, { rateCounter: rate });
      }
    } else {
      dataToAssess = Object.assign(dataToAssess, { entityHistory: [] });
    }

    const multipleInputArrows = (selectn('.ruleSetParams.arrowData', step));
    if (multipleInputArrows) {
      dataToAssess = Object.assign(dataToAssess, { arrowData: multipleInputArrows });
    }
    const events = await re.run(dataToAssess);
    if (!events.length) {
      if (step.onFailSiloId) {
        return Object.assign({ mode: 'fail' }, entityData, voltData);
      }
      return null; // nothing to do here
    }
    return Object.assign({ mode: 'pass' }, entityData, voltData);
  };

  const promises = [];
  for (const entity of entities) {
    promises.push(processor(entity));
  }
  const processedEntities = (await Promise.all(promises)).filter((res) => res);
  if (processedEntities.length) {
    return transformEntitiesOutput(processedEntities, step);
  }
  return null;
}

module.exports = {
  runRuleSet
};
