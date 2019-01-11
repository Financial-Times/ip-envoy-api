import knex from '../../db/connect'

async function findByType(trackId, siloTypeId) { // Finds the source silo and stepId for given track
  const rs = await knex.raw(`
    SELECT silo."siloId", silo.name AS "siloName", "siloType"."name" AS "siloTypeName", track.name as "trackName"
    FROM core."silo"
    LEFT JOIN core."trackRev" ON silo."trackRevId" = "trackRev"."trackRevId"
    LEFT JOIN core."track" ON "trackRev"."trackId" = "track"."trackId"
    INNER JOIN core."siloType" ON silo."siloTypeId" = "siloType"."siloTypeId"
    AND "siloType"."siloTypeId" = ?
    WHERE "track"."trackId" = ?
    ORDER BY silo."siloId"
  `, [siloTypeId, trackId])

  return {
    trackId,
    siloTypeId,
    siloId: rs.rows[0].siloId,
    siloName: rs.rows[0].siloName,
    siloTypeName: rs.rows[0].siloTypeName
  }
}

async function findStartingId(trackId) {
  return (findByType(trackId, 1))
}

// Find all source silos for given entityType (remeber, each track can only host one entityType)
async function findAllSources(entityTypeName) {
  const rs = await knex.raw(`
    SELECT silo."siloId", silo.name AS "siloName", "siloType"."name" AS "siloTypeName", track.name as "trackName"
    FROM core."silo"
    LEFT JOIN core."trackRev"
      ON silo."trackRevId" = "trackRev"."trackRevId"
    LEFT JOIN core."track"
      ON "trackRev"."trackId" = "track"."trackId"
    INNER JOIN core."siloType"
      ON silo."siloTypeId" = "siloType"."siloTypeId"
    WHERE "siloType"."siloTypeId" = 1
    AND "track"."entityTypeName" = ?
  `, [entityTypeName])
  return rs.rows
}

// Takes a siloId and returns how many entities are currently in it
async function entityCount(siloId) {
  const rs = await knex.raw(`
    SELECT COUNT(*)
    FROM core."entity_silo" AS es
    LEFT JOIN core."entity_silo" AS esx
    ON esx."parent_entity_silo_id" = es."entity_silo_id"
    WHERE es."siloId" = ?
    AND esx."parent_entity_silo_id" IS NULL
  `, [siloId])
  return rs.rows
}

// Takes a siloId and returns how many entities have ever moved through it in given time
async function activityCount(siloId, minutes) {
  const rs = await knex.raw(`
    SELECT COUNT(*) AS "rate"
    FROM core."entity_silo" AS es
    WHERE es."siloId" = ?
    AND (now()::time - (interval '1 minutes') * ?) < es.created::time
  `, [siloId, minutes])
  return rs.rows
}

async function entityHistory(siloId, entityId = false) {
  const rs = await knex.raw(`
    SELECT "entityId", "created", "siloVisitCount", EXTRACT(MINUTE FROM now() - "created") AS minsAgo
    FROM core."entity_silo" AS es
    WHERE es."siloId" = ?
    AND es."entityId" = ?
    `, [siloId, entityId])
  return rs.rows
}

async function addToFirst(track, entityIds) {
  const { trackId, entityTypeName } = track
  const firstSilo = await findStartingId(trackId)

  const entitySteps = []

  entityIds.forEach(entityId => {
    entitySteps.push({
      siloId: firstSilo.siloId,
      entityId,
      entityTypeName
    })
  })
  const res = (await knex.insert(entitySteps).into('core.entity_silo')
    .returning('entity_silo_id'))
  return res
}

async function getEntitiesBySilo(siloId) {
  // If this causes performance problems this will need to be refactored with some of the handling
  // done in JS due to SQL limitations. (tried pSQL EXCEPT - not suitable)
  const rs = await knex.raw(`
    SELECT es."siloId", es."entityId", es."entityTypeName", e."currentData", e."ruleSetRun", silo."siloTypeId", es."created" AS "movedToSilo", es."siloVisitCount"
    FROM core."entity_silo" AS es
    INNER JOIN core."entity" AS e
    ON e."entityId" = es."entityId"
    INNER JOIN core."silo"
    ON "silo"."siloId" = es."siloId"
    LEFT JOIN core."entity_silo" AS esx
    ON esx."parent_entity_silo_id" = es."entity_silo_id"
    WHERE es."siloId" = ?
    AND esx."parent_entity_silo_id" IS NULL
  `, [siloId])

  return rs.rows
}

async function add({ name, descr, trackRevId, siloTypeId }) {
  return (await knex
    .returning('*')
    .insert({ name, descr, trackRevId, siloTypeId })
    .into('core.silo'))[0]
}

async function addSiloType(name, descr) {
  return (await knex
    .returning('*')
    .insert({ name, descr })
    .into('core.siloType'))[0]
}

export {
  findByType,
  findStartingId,
  addToFirst,
  findAllSources,
  entityCount,
  activityCount,
  entityHistory,
  getEntitiesBySilo,
  add,
  addSiloType
}
