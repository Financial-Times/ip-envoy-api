const { connect } = require("../../db/connect");

function getDeletionFn(knex,  trx, trackId, entities) {
  return function(table) {
    return knex.raw(`
    DELETE FROM ${table}
    WHERE entity_silo_id IN (
      SELECT distinct(entity_silo_id)
      FROM core."entity_silo" es
      INNER JOIN core."silo" s on es."siloId" = s."siloId"
      INNER JOIN core."trackRev" tr ON s."trackRevId" = tr."trackRevId"
      inner join core.track t ON tr."trackId" = t."trackId"
      WHERE t."trackId" = ${trackId}
      AND es."entityId" in (${entities.map(e => `'${e}'`).join(', ')})
    )
  `).transacting(trx)
  }
}

function deleteFromTrack({ trackId, entities, entityType }) {
  const knex = connect(entityType);
  return knex.transaction(trx => {
    const deleteFn = getDeletionFn(knex, trx, trackId, entities);
    // Any error here will cause a Rollback of the transaction.
    return Promise.all([
      deleteFn('core.channel_entity_silo_log'),
      deleteFn('core.entity_silo')
    ])
  })
}

function deleteFromJourney({ journeyId, entities, entityType }) {
   // SD TODO
   console.warn("deleteFromJourney NOT yet implelented in v2");
   return Promise.resolve(true);
}

module.exports = {
  deleteFromTrack, // this can go once we have migrated to v2
  deleteFromJourney
};
