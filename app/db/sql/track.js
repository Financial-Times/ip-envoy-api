const { connect }  = require("../../db/connect");

async function list(entityType, statusIds = [1, 2, 3, 4, 5]) {
  const ids = statusIds.join(","); // needed due to knex weirdness
  const knex = connect(entityType);
  const res = await knex.raw(`
    SELECT * FROM "core"."track"
    WHERE "track"."trackStatusId" IN (${ids})
  `);
  return res.rows;
}

async function getById(trackId, entityType) {
  const knex = connect(entityType);
  const res = await knex.raw(`
    SELECT * FROM "core"."track"
    WHERE "trackId" = ?
  `, trackId);
  return res.rows[0];
}

async function getLast(entityType) {
  const knex = connect(entityType);
  const res = await knex.raw(`
    SELECT * FROM "core"."track"
    ORDER BY "trackId" DESC LIMIT 1
  `);
  return res.rows[0];
}

async function updateTrack(trackId, name, descr, trackStatusId, entityType) {
  const knex = connect(entityType);
  await knex("core.track")
    .where("trackId", trackId)
    .update({ name, descr, trackStatusId });
  const res = await getById(trackId, entityType);
  return res;
}

module.exports = {
  list,
  getById,
  getLast,
  updateTrack
};
