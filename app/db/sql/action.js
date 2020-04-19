const { connect } = require("../connect");

async function list({ entityType }) {
  const knex = connect(entityType);
  let query = `
    SELECT * from core.action_silo
    LEFT JOIN core.action
    ON action_silo."actionId" = action."actionId"
    LEFT JOIN core."actionType"
    ON action."actionTypeId" = "actionType"."actionTypeId"
  `;
  const res = await knex.raw(query);
  return res.rows;
}

module.exports = {
  list
};
