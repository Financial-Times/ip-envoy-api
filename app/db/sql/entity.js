const { connect } = require("../../db/connect");

function deleteByTable(knex, table, trx, trackId, entities) {
  return knex.raw(`
  delete FROM ${table}
  WHERE entity_silo_id IN (
    select distinct(entity_silo_id)
    FROM core."entity_silo" es
    inner join core."silo" s on es."siloId" = s."siloId"
    inner join core."trackRev" tr on s."trackRevId" = tr."trackRevId"
    inner join core.track t on tr."trackId" = t."trackId"
    where t."trackId" = ${trackId}
    and es."entityId" in (${entities.map(e => `'${e}'`).join(', ')})
    )
  `).transacting(trx)
}

function deleteFromTrack({ trackId, entities, entityType }) {
  const knex = connect(entityType);
  return knex.transaction(trx => {
    return Promise.all([
      deleteByTable(knex, 'core.channel_entity_silo_log', trx, trackId, entities),
      deleteByTable(knex, 'core.entity_silo', trx, trackId, entities)
    ])
  })
}

module.exports = {
  deleteFromTrack
};
