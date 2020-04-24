const { connect } = require("../connect");

async function list({ entityType, journeyId }) {
  const knex = connect(entityType);
  let query = `
    SELECT * from core.silo s
    LEFT JOIN (SELECT "siloTypeId", name as "siloTypeName" from core."siloType") st
    ON s."siloTypeId" = st."siloTypeId"
  `;
  if (journeyId) {
    query += `
      WHERE "journeyId" = :journeyId
    `;
  }
  const res = await knex.raw(query, { journeyId });
  return res.rows;
}

module.exports = {
  list
};
