const knex = require('../../db/connect')

async function haveChannelType({ name, config }) {
  config = JSON.stringify(config)
  const rs = await knex
    .select('*')
    .from('core.channelType')
    .where('name', name)
  if (!rs.length) { // no record exists by this name, so make one and return the id
    const rs2 = (await knex.insert([{ // create new and return new id
      name, config
    }], '*').into('core.channelType'))
    return rs2[0]
  }
  return rs[0]
}

async function haveChannel({ name, descr, config }, channelTypeId) {
  config = JSON.stringify(config)
  const rs = await knex
    .select('*')
    .from('core.channel')
    .where('name', name)
  if (!rs.length) { // no record exists by this name, so make one and return the id
    return (await knex.insert([{ // create new and return new id
      name, descr, channelTypeId, config
    }], '*').into('core.channel'))[0]
  }
  return rs[0]
}

async function getChannels() {
  const res = await knex
    .select('*')
    .from('core.channel')
  return res
}

async function getChannelTypes() {
  const res = await knex
    .select('*')
    .from('core.channelType')
  return res
}

// returns channels assigned to a silo, along with entityData, for entities that have not yet
// been activated on channel (in other words, don't send stuff twice)
// Note SQL below can be expanded to expose more data for the channel to consume if needed
// For example, joining on to the event table to get events history
async function getForSilo(siloId) {
  const rs = await knex.raw(`
    SELECT (SELECT "siloControl".descr
        FROM core."silo" AS "siloControl"
        INNER JOIN core.entity_silo as "esControl"
          ON "esControl"."entityId" = es."entityId"
          AND "esControl"."siloId" = "siloControl"."siloId"
        WHERE "siloControl"."trackRevId" = "trackRev"."trackRevId"
          AND "siloControl".descr ILIKE '#control.%'
        GROUP BY "esControl".created, "siloControl".descr
        ORDER BY "esControl".created DESC
        LIMIT 1 ) AS "controlTag",
      "silo"."siloId",
      "silo"."name" AS "siloName",
      st."siloTypeId", st."name" AS "siloTypeName",
      cs."channelId" AS "channelId",
      cs."config" AS "config",
      cs."channel_silo_id" AS "channelSiloId",
      c."name" AS channelName,
      c."descr" AS channelDescr,
      ct."channelTypeId" AS channelTypeId,
      ct."name" AS channelTypeName,
      es."entityId" AS "entityId",
      es."entityTypeName" AS "entityTypeName",
      es."created" AS "siloLandTime",
      es."lastStepId" AS "lastStepId",
      es."entity_silo_id" AS "entity_silo_id",
      es."parent_entity_silo_id" AS "parent_entity_silo_id",
      e."currentData" AS "currentData",
      e."created" AS "trackStartTime",
      "trackRev"."trackRevId",
      "track"."trackId",
      "track"."name" AS "trackName"
    FROM core."silo"
    INNER JOIN core."trackRev"
      ON "trackRev"."trackRevId" = silo."trackRevId"
    INNER JOIN core."track" AS "track"
      ON "track"."trackId" = "trackRev"."trackId"
    INNER JOIN core."channel_silo" AS cs
      ON cs."siloId" = "silo"."siloId"
    INNER JOIN core."channel" AS c
      ON c."channelId" = cs."channelId"
    INNER JOIN core."channelType" AS ct
      ON ct."channelTypeId" = c."channelTypeId"
    INNER JOIN core."siloType" AS st
    ON st."siloTypeId" = "silo"."siloTypeId"
    INNER JOIN core."entity_silo" AS es
      ON es."siloId" = "silo"."siloId"
    LEFT JOIN core."entity_silo" AS esx
      ON esx."parent_entity_silo_id" = es."entity_silo_id"
    LEFT JOIN core."channel_entity_silo_log" AS ceslx
      ON ceslx."entity_silo_id" = es."entity_silo_id"
      AND ceslx."channel_silo_id" = cs."channel_silo_id"
    INNER JOIN core."entity" AS e
      ON e."entityId" = es."entityId"
      AND e."entityTypeName" = es."entityTypeName"
    WHERE "silo"."siloId" = ?
      AND esx."parent_entity_silo_id" IS NULL
      AND ceslx."channel_silo_id" IS NULL -- Don't activate channel again if already done for this entity
    ORDER BY e."entityId"
    `, [siloId]);
  return rs.rows
}

async function logSend(entitySiloLogs) {
  const res = (await knex.insert(entitySiloLogs).into('core.channel_entity_silo_log'));
  return res
}

// used to purge entity_silo_log for housekeeping purposes
// This function is currently not in use, replaced by purgeAllDrainedLogs()
async function purgeLog(entityId, entityTypeName, drainSiloId) {
  await knex.raw(`
    DELETE FROM "core"."channel_entity_silo_log"
    WHERE "channel_entity_silo_log"."entity_silo_id" IN (
      SELECT es."entity_silo_id"
      FROM "core"."entity_silo" AS es
      INNER JOIN "core"."silo" AS s
      ON s."siloId" = es."siloId"
      WHERE s."siloId" = ?
      AND s."siloTypeId" = 4
      AND es."entityId" = ?
      AND es."entityTypeName" = ?
    )
  `, drainSiloId, entityId, entityTypeName);
}

// used to purge all entity_silo_logs where entity has reached a drain
async function purgeAllDrainedLogs() {
  await knex.raw(`
    DELETE FROM "core"."channel_entity_silo_log"
    WHERE "channel_entity_silo_log"."entity_silo_id" IN (
      SELECT es.entity_silo_id
      FROM core.entity_silo AS esDrain
      INNER JOIN core.silo AS "drainSilos"
      ON "drainSilos"."siloId" = esDrain."siloId"
      AND "drainSilos"."siloTypeId" = 4
      INNER JOIN core.silo AS "allSilos"
      ON "allSilos"."trackRevId" = "drainSilos"."trackRevId"
      INNER JOIN core.entity_silo AS es
      ON es."siloId" = "allSilos"."siloId"
      AND es."entityId" = esDrain."entityId"
    );
  `);
}

module.exports = {
  haveChannelType,
  haveChannel,
  getChannels,
  getChannelTypes,
  getForSilo,
  logSend,
  purgeLog,
  purgeAllDrainedLogs
}
