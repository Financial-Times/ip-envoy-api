//const channelHandlers = require('../plugins/channels');
const channelSQL = require('../db/sql/channel');
const { logger } = require('../logger');
//const templater = require('../utils/templater');
//const config = require('../../config.js');

// async function log(entityRows) {
//   const channelSiloLogEntities = entityRows.map((entity) => {
//     return {
//       entity_silo_id: entity.entity_silo_id,
//       channel_silo_id: entity.channelSiloId,
//       logData: (config.writeChannelDataToDb && entity.config) ? { data: entity.config } : {}
//     };
//   });

//   try {
//     await channelSQL.logSend(channelSiloLogEntities);
//   } catch (err) {
//     logger.error(err);
//   }
// }

// function mergeEntityData(entityRows, entities = {}) {
//   return entityRows.map((entityRow) => {
//     let entityConfig;
//     if (typeof entityRow.config === 'string') { // json in a string (older lucid importer does this)
//       entityConfig = JSON.parse(templater(entityRow.config || '{}', entityRow));
//     } else {
//       entityConfig = entityRow.config;
//     }
//     const data = entities[entityRow.entityId] || {};
//     return Object.assign(
//       {},
//       entityRow,
//       { data },
//       { config: entityConfig });
//   });
// }

// function mapChannels(entityRows) {
//   return entityRows.reduce((mappedChannels, entityRow) => {
//     const targetChannel = config.production || config.force_enable_channel ?
//       entityRow.channelId : channelHandlers.registry.nameToId.channelOutput;
//     if (mappedChannels[targetChannel]) {
//       mappedChannels[targetChannel].push(entityRow);
//     } else {
//       mappedChannels[targetChannel] = [entityRow];
//     }
//     return mappedChannels;
//   }, {});
// }

// async function send(mappedChannels) {
//   return Promise.all(Object.keys(mappedChannels).map(async (channelId) => {
//     // This will need refactoring, with the current code all channels must succeed before we log
//     // the resulting channel activation
//     const entities = mappedChannels[channelId].filter((e) => (e.controlTag !== '#control.on'));
//     const res = await channelHandlers.registry.byId[channelId].send(entities)
//       .then((r) => {
//         log(entities, {});
//         return r;
//       });
//     return !(res.some((r) => r === false));
//   }));
// }

async function getTypes() {
  const typesData = await channelSQL.getChannelTypes();
  return typesData;
}

async function get() {
  const data = await channelSQL.getChannels();
  return data;
}

// async function activateChannels(siloId, entities) {
//   if (!siloId) {
//     return Promise.reject('no siloId');
//   }
//   const channelEntityData = await channelSQL.getForSilo(siloId);
//   if (!channelEntityData.length) {
//     return true;
//   }
//   const data = mergeEntityData(channelEntityData, entities);
//   const channelData = mapChannels(data);
//   try {
//     const res = await send(channelData);
//     return !(res.some((r) => r === false));
//   } catch (err) {
//     logger.error(err);
//     return Promise.reject('problem');
//   }
// }

module.exports = {
  //send,
  //mergeEntityData,
  //activateChannels,
  getTypes,
  get
};
