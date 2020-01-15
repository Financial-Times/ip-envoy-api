const { connect } = require("../connect");

async function list(entityType, statusIds = [1, 2, 3, 4, 5]) {
  const knex = connect(entityType);
  const res = await knex.raw(`
    SELECT * from core.journey
    WHERE "journeyStatusId" = ANY (:statusIds)
  `, {statusIds});
  return res.rows;
}

async function getById(journeyId, entityType) {
  const knex = connect(entityType);
  const res = await knex.raw(`
    SELECT * from core.journey
    WHERE "journeyId" = :journeyId
  `,
  {journeyId}
  );
  return res.rows[0];
}

async function getLast(entityType) {
  const knex = connect(entityType);
  const res = await knex.raw(`
  SELECT * from core.journey
    ORDER BY "journeyId" DESC LIMIT 1
  `);
  return res.rows[0];
}

async function updateJourney(journeyId, descr, journeyStatusId, entityType) {
  const knex = connect(entityType);
  await knex("core.journey")
    .where("journeyId", journeyId)
    .update({ descr, journeyStatusId });
  const res = await getById(journeyId, entityType);
  return res;
}

module.exports = {
  list,
  getById,
  getLast,
  updateJourney
};
