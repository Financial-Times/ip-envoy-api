import knex from '../../db/connect'

// Return a list of tracks that the given entity resides within, along with the source silo
async function getTracks(entityId, statuses = [3] /* live */) {
  // look up status of track
  const statusIds = statuses.join('\',\'');
  const rs = await knex.raw(`
    SELECT silo."siloId" AS "sourceSiloId", "trackRev"."trackId"
    FROM core."silo"
    INNER JOIN core."entity_silo" AS es
    ON es."siloId" = "silo"."siloId"
    INNER JOIN core."trackRev"
    ON "trackRev"."trackRevId" = "silo"."trackRevId"
    INNER JOIN core."track"
    ON "track"."trackId" = "trackRev"."trackId"
    WHERE es."entityId" = ?
    AND silo."siloTypeId" = 1
    AND track."trackStatusId" IN ('${statusIds}')
  `, [entityId]);
  return rs.rows;
}

async function addEntityType(name) {
  return (await knex.returning('*').insert({ name }).into('core.entityType'))[0];
}

async function get(entityId) {
  const rs = await knex
    .select('*')
    .from('core.entity')
    .where('entityId', entityId)
  return rs[0]
}

async function getMany(entityIds) {
  const rs = await knex
    .select('*')
    .from('core.entity')
    .whereIn('entityId', entityIds)
  return rs
}

export { getTracks, addEntityType, get, getMany  }
