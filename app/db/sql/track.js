const knex = require("../../db/connect");
const trackRevSQL = require("./trackRev");

async function list(statusIds = [1, 2, 3, 4, 5]) {
  const ids = statusIds.join(","); // needed due to knex weirdness
  return knex.raw(`
    SELECT *
    FROM "core"."track"
    INNER JOIN "core"."trackRev"
    ON "trackRev"."trackId" = "track"."trackId"
    WHERE "track"."deleted" IS NULL
    AND "trackRev"."deleted" IS NULL
    AND "track"."trackStatusId" IN (${ids})
  `);
}

async function getById(trackId) {
  return knex
    .select("*")
    .from("core.track")
    .innerJoin("core.trackRev", "trackRev.trackId", "track.trackId")
    .where({ "track.trackId": trackId })
    .whereNull("track.deleted")
    .whereNull("trackRev.deleted");
}

async function getSourceSilos(trackRevId) {
  // Returns the source silo/s for a track
  const rs = await knex.raw(
    `
    SELECT "siloId"
    FROM core."silo"
    WHERE "silo"."trackRevId" = ?
    AND "silo"."siloTypeId" = 1
  `,
    trackRevId
  );
  return rs.rows;
}

async function queryLatestRevision(trackId) {
  // find the latest revisionId for a track (not to be confused with active)
  const res = await knex.raw(
    `
   SELECT *
   FROM "core"."track"
   INNER JOIN "core"."trackRev"
   ON "trackRev"."trackId" = "track"."trackId"
   AND "trackRev"."trackRevId" = (
     SELECT MAX("trackRevId")
     FROM "core"."trackRev"
     WHERE "trackRev"."trackId" = "track"."trackId"
     AND "trackRev"."deleted" IS NULL
   )
   WHERE "track"."deleted" IS NULL
   AND "track"."trackId" = ?
 `,
    trackId
  );

  return res.rows[0];
}

async function setCurrentRevById(trackId, trackRevId) {
  // set the current active track Revision Id
  const rs = await knex.raw(
    `
    UPDATE core."track" SET
    "currentTrackRevId" = ?
    WHERE "track"."trackId" = ?
  `,
    [trackRevId, trackId]
  );
  return rs;
}

async function getCurrentRevById(trackId) {
  // set the current active track Revision Id
  const rs = await knex.raw(
    `
    SELECT "currentTrackRevId"
    FROM core."track"
    WHERE track."trackId" = ?
  `,
    [trackId]
  );
  return rs;
}

async function getState(trackId) {
  const rs = await knex.raw(
    `
    SELECT "trackStatus"."trackStatusId", "trackStatus"."name"
    FROM core."track"
    INNER JOIN core."trackStatus"
    ON "trackStatus"."trackStatusId" = "track"."trackStatusId"
    WHERE "track"."trackId" = ?
  `,
    [trackId]
  );
  return {
    trackId,
    trackStatusId: rs.rows[0].trackStatusId,
    trackStatusName: rs.rows[0].name
  };
}

async function setState(trackId, trackStatusId) {
  return (await knex("core.track")
    .returning("*")
    .where("trackId", trackId)
    .update({
      trackStatusId
    }))[0];
}

async function getTrack(trackId, overrideRevision) {
  const trackRevId =
    overrideRevision ||
    (await getCurrentRevById(trackId)).rows[0].currentTrackRevId;

  const rs = await knex.raw(
    `
    SELECT "voltQuery", "entityTypeName"
    FROM core."trackRev"
    INNER JOIN core."track"
    ON "track"."trackId" = "trackRev"."trackId"
    AND "trackRev"."trackRevId" = ?
    WHERE "track"."trackId" = ?
  `,
    [trackRevId, trackId]
  );

  return {
    voltQuery: rs.rows[0].voltQuery,
    entityTypeName: rs.rows[0].entityTypeName
  };
}

async function add({
  name,
  descr,
  entityTypeName,
  campaignRevId,
  trackStatusId
}) {
  return (await knex
    .returning("*")
    .insert([{ name, descr, entityTypeName, campaignRevId, trackStatusId }])
    .into("core.track"))[0];
}

async function updateTrack(trackId, name, descr, statudId) {
  await knex("core.track")
    .where("trackId", trackId)
    .update({ name, descr, trackStatusId: statudId });
  const res = await trackRevSQL.getByTrackId(trackId);
  return res[0];
}

async function addTrackRev(trackId, isActive = true) {
  return (await knex
    .returning("*")
    .insert({ trackId, isActive })
    .into("core.trackRev"))[0];
}

async function addTrackStatus({ trackStatusId, name, descr = null }) {
  return (await knex
    .returning("trackStatusId")
    .insert([{ trackStatusId, name, descr }])
    .into("core.trackStatus"))[0];
}

module.exports = {
  list,
  getById,
  getSourceSilos,
  queryLatestRevision,
  setCurrentRevById,
  getCurrentRevById,
  getState,
  setState,
  getTrack,
  add,
  addTrackRev,
  addTrackStatus,
  updateTrack
};
