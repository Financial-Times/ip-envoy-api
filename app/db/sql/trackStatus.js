const knex = require('../../db/connect')

async function getStatus() {
  const column = [
    'trackStatus.trackStatusId',
    'trackStatus.name'
  ]
  return knex.select(column)
    .from('core.trackStatus')
}
module.exports = { getStatus }
