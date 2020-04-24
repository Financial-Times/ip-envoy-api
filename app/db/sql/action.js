const { connect } = require("../connect");

async function list({ entityType }) {
  const knex = connect(entityType);
  let query = `
    SELECT * from core.action_silo s
    LEFT JOIN (SELECT "actionId", "actionTypeId", name as "actionName" from core.action) a
    ON s."actionId" = a."actionId"
    LEFT JOIN (SELECT "actionTypeId", name as "actionTypeName" from core."actionType") at
    ON a."actionTypeId" = at."actionTypeId"
  `;
  const res = await knex.raw(query);
  return res.rows;
}

module.exports = {
  list
};
