const { connect } = require("../../db/connect");

async function list(entityType, statusIds = [1, 2, 3, 4, 5]) {
  const ids = statusIds.join(","); // needed due to knex weirdness
  const knex = connect(entityType);
  const res = await knex.raw(`
    SELECT t.*, tr.created FROM "core"."track" t
    INNER JOIN "core"."trackRev" tr
    ON t."trackId" = tr."trackId"
    WHERE "t"."trackStatusId" IN (${ids})
  `);
  return res.rows;
}

async function getById(trackId, entityType) {
  const knex = connect(entityType);
  const res = await knex.raw(
    `
    SELECT t.* FROM "core"."track" t
    INNER JOIN "core"."trackRev" tr
    ON t."trackId" = tr."trackId"
    WHERE t."trackId" = ?
  `,
    trackId
  );
  return res.rows[0];
}

async function getLast(entityType) {
  const knex = connect(entityType);
  const res = await knex.raw(`
    SELECT t.* FROM "core"."track" t
    INNER JOIN "core"."trackRev" tr
    ON t."trackId" = tr."trackId"
    ORDER BY t."trackId" DESC LIMIT 1
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
