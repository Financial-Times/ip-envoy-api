const { connect } = require("../connect");

async function list(entityType) {
  const knex = connect(entityType);
  const res = await knex.raw(`
    SELECT * from core.step
  `);
  return res.rows;
}

module.exports = {
  list
};
