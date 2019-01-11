
import knex from '../../db/connect'

async function getAllScheduled(statuses = [3]) {
  /*
    Figure out all that rules that need to be run.
    So, find all silos that have schedule flag set to true, make sure the silo has at least one
    current occupant, make sure silos are of type 1,2,3 (ie, not a drain).
    Then for all silos, get all rules to which they are linked
    The distinct list of ruleSetIds will be used so we don't need to run unnecesary rules
  */
  const statusIds = statuses.join(',') // needed due to knex weirdness

  const rs = await knex.raw(`
    SELECT DISTINCT ON ("silo"."siloId", "ruleSet"."ruleSetId", "passSilo"."siloId", "step"."priority")
    "controlIds"."ids" "controlentityids",
    "silo"."trackRevId", "silo"."siloId", "track"."name" as "trackName",
    "passSilo"."name" AS "passSiloName",
    "passSilo"."descr" AS "passSiloDescr",
    "silo"."siloTypeId" AS "siloTypeId",
    "siloType"."name" AS "passSiloTypeName",
    "siloType"."descr" AS "passSiloTypeDescr",
    "failSilo"."name" AS "failSiloName",
    "failSilo"."descr" AS "failSiloDescr",
    "failSiloType"."siloTypeId" AS "failSiloTypeId",
    "failSiloType"."name" AS "failSiloTypeName",
    "failSiloType"."descr" AS "failSiloTypeDescr",
    "silo"."name" AS "currentSiloName",
    "step"."ruleSetParams",
    "step"."stepId", "ruleSet".volt_query AS "voltQuery", "ruleSet".volt_query_key AS "voltQueryKey", "step"."ruleSetId", "step"."priority", "step"."onPassSiloId", "step"."currentSiloId", "step"."onFailSiloId"
    FROM core."ruleSet"
    INNER JOIN core."step"
    ON "step"."ruleSetId" = "ruleSet"."ruleSetId"
    INNER JOIN core."silo"
    ON "silo"."siloId" = "step"."currentSiloId"
    AND "silo"."siloTypeId" IN (1,2,3)
    INNER JOIN core."siloType"
    ON "siloType"."siloTypeId" = silo."siloTypeId"
    LEFT JOIN core."silo" AS "failSilo"
    ON "failSilo"."siloId" = step."onFailSiloId"
    LEFT JOIN core."silo" AS "passSilo"
    ON "passSilo"."siloId" = step."onPassSiloId"
    LEFT JOIN core."siloType" AS "failSiloType"
    ON "failSiloType"."siloTypeId" = "failSilo"."siloTypeId"
    INNER JOIN core."trackRev"
    ON "trackRev"."trackRevId" = silo."trackRevId"
    INNER JOIN core."track"
    ON track."trackId" = "trackRev"."trackId"
    AND track."trackStatusId" IN (${statusIds})
    INNER JOIN core."entity_silo" AS es
    ON es."siloId" = "silo"."siloId"
    LEFT JOIN core."entity_silo" AS esx
    ON esx."parent_entity_silo_id" = es."entity_silo_id"
    LEFT JOIN (
        SELECT string_agg("hashTags"."entityId", ',') "ids", "hashTags"."trackRevId" FROM (
        SELECT DISTINCT ON ("IES"."entityId") "IES"."entityId", "silo"."descr", "silo"."trackRevId"
        FROM core.entity_silo AS "IES"
        INNER JOIN core.silo
        ON silo."siloId" = "IES"."siloId"
        AND silo.descr ILIKE '#control.%'
        ORDER BY "IES"."entityId" ASC, "IES".created DESC
    ) AS "hashTags"
    WHERE "hashTags".descr ILIKE '#control.on%'
    GROUP BY "hashTags"."trackRevId"
    ) AS "controlIds"
    ON "controlIds"."trackRevId" = "trackRev"."trackRevId"
    WHERE "ruleSet"."scheduled" = true
    AND esx."parent_entity_silo_id" IS NULL
    ORDER BY "silo"."siloId", "ruleSet"."ruleSetId", "passSilo"."siloId", "step"."priority"
  `)
  return rs.rows
}

async function getAllStarting(statuses = [3]) {
  const statusIds = statuses.join(',') // needed due to knex weirdness
  const rs = await knex.raw(`
    SELECT "silo"."trackRevId", "track"."name" as "trackName",
    "silo"."name" AS "passSiloName",
    "silo"."descr" AS "passSiloDescr",
    "silo"."siloTypeId" AS "siloTypeId",
    "siloType"."name" AS "passSiloTypeName",
    "siloType"."descr" AS "passSiloTypeDescr",
    "failSilo"."name" AS "failSiloName",
    "failSilo"."descr" AS "failSiloDescr",
    "failSiloType"."siloTypeId" AS "failSiloTypeId",
    "failSiloType"."name" AS "failSiloTypeName",
    "failSiloType"."descr" AS "failSiloTypeDescr",
    "step"."ruleSetId", "ruleSet".volt_query_key AS "voltQueryKey", "ruleSet".volt_query AS "voltQuery", "step"."currentSiloId", "step"."priority", "step"."stepId", "step"."onPassSiloId", "step"."onFailSiloId", "step"."ruleSetParams",
    "ruleSet"."scheduled"
    FROM core."ruleSet"
    INNER JOIN core."step"
    ON step."ruleSetId" = "ruleSet"."ruleSetId"
    INNER JOIN core."silo"
    ON silo."siloId" = "step"."onPassSiloId"
    INNER JOIN core."siloType"
    ON "siloType"."siloTypeId" = silo."siloTypeId"
    LEFT JOIN core."silo" AS "failSilo"
    ON "failSilo"."siloId" = step."onFailSiloId"
    LEFT JOIN core."siloType" AS "failSiloType"
    ON "failSiloType"."siloTypeId" = "failSilo"."siloTypeId"
    INNER JOIN core."trackRev"
    ON "trackRev"."trackRevId" = "silo"."trackRevId"
    INNER JOIN core."track"
    ON track."trackId" = "trackRev"."trackRevId"
    WHERE step."currentSiloId" IS NULL
    AND "track"."trackStatusId" IN (${statusIds})
    ORDER BY step.priority
  `)
  return rs.rows
}

async function getBySilo(siloId) {
  const rs = await knex.raw(`
    SELECT
    (SELECT string_agg("hashTags"."entityId", ',') FROM (
      SELECT DISTINCT ON ("IES"."entityId") "IES"."entityId", "silo"."descr"
      FROM core.entity_silo AS "IES"
      INNER JOIN core.silo
      ON silo."siloId" = "IES"."siloId"
      INNER JOIN core."trackRev" AS "ITR"
      ON "ITR"."trackRevId" = silo."trackRevId"
      WHERE "ITR"."trackRevId" = "trackRev"."trackRevId"
      AND silo.descr ILIKE '#control.%'
      ORDER BY "IES"."entityId" ASC, "IES".created DESC
    ) AS "hashTags"
    WHERE "hashTags".descr ILIKE '#control.on%'
  ) AS controlEntityIds,
     "silo"."trackRevId", "track"."name" as "trackName",
    "silo"."name" AS "passSiloName",
    "silo"."descr" AS "passSiloDescr",
    "silo"."siloTypeId" AS "siloTypeId",
    "siloType"."name" AS "passSiloTypeName",
    "siloType"."descr" AS "passSiloTypeDescr",
    "failSilo"."name" AS "failSiloName",
    "failSilo"."descr" AS "failSiloDescr",
    "failSiloType"."siloTypeId" AS "failSiloTypeId",
    "failSiloType"."name" AS "failSiloTypeName",
    "failSiloType"."descr" AS "failSiloTypeDescr",
    "currentSilo"."name" AS "currentSiloName",
    "step"."currentSiloId", "step"."stepId", "step"."priority",
    "ruleSet".volt_query AS "voltQuery", "step"."ruleSetId",
    "step"."onPassSiloId", "step"."onFailSiloId",
    "step"."ruleSetParams",
    "ruleSet"."scheduled"
    FROM core."ruleSet"
    INNER JOIN core."step"
    ON step."ruleSetId" = "ruleSet"."ruleSetId"
    INNER JOIN core."silo"
    ON silo."siloId" = step."onPassSiloId"
    INNER JOIN core."trackRev"
    ON "trackRev"."trackRevId" = "silo"."trackRevId"
    INNER JOIN core."track"
    ON track."trackId" = "trackRev"."trackRevId"
    INNER JOIN core."siloType"
    ON "siloType"."siloTypeId" = silo."siloTypeId"
    LEFT JOIN core."silo" AS "failSilo"
    ON "failSilo"."siloId" = step."onFailSiloId"
    LEFT JOIN core."silo" AS "currentSilo"
    ON "currentSilo"."siloId" = step."currentSiloId"
    LEFT JOIN core."siloType" AS "failSiloType"
    ON "failSiloType"."siloTypeId" = "failSilo"."siloTypeId"
    WHERE "step"."currentSiloId" = ?
    ORDER BY step.priority
  `, [siloId])
  return rs.rows
}

async function getAllMonitoring(siloIds) {
  // return all steps that have a ruleset monitored by another silo
  const ids = siloIds.join(',') // needed due to knex weirdness

  const rs = await knex.raw(`
    SELECT DISTINCT "silo"."trackRevId", "track"."name" as "trackName",
    "silo"."siloId",
    "silo"."siloTypeId" AS "siloTypeId",
    "silo"."name" AS "passSiloName",
    "silo"."descr" AS "passSiloDescr",
    "siloType"."name" AS "passSiloTypeName",
    "siloType"."descr" AS "passSiloTypeDescr",
    "failSilo"."name" AS "failSiloName",
    "failSilo"."descr" AS "failSiloDescr",
    "failSiloType"."siloTypeId" AS "failSiloTypeId",
    "failSiloType"."name" AS "failSiloTypeName",
    "failSiloType"."descr" AS "failSiloTypeDescr",
    "currentSilo"."name" AS "currentSiloName",
    "step"."stepId", "ruleSet".volt_query AS "voltQuery", "ruleSet".volt_query_key AS "voltQueryKey", "step"."ruleSetId", "step"."priority", "step"."onPassSiloId", "step"."currentSiloId", "step"."onFailSiloId",
    "ruleSet"."scheduled"
    FROM core."ruleSet"
    INNER JOIN core."step"
    ON "step"."ruleSetId" = "ruleSet"."ruleSetId"
    INNER JOIN core."silo"
    ON "silo"."siloId" = "step"."currentSiloId"
    AND "silo"."siloTypeId" IN (1,2,3)
    INNER JOIN core."siloType"
    ON "siloType"."siloTypeId" = silo."siloTypeId"
    LEFT JOIN core."silo" AS "failSilo"
    ON "failSilo"."siloId" = step."onFailSiloId"
    LEFT JOIN core."silo" AS "currentSilo"
    ON "currentSilo"."siloId" = step."currentSiloId"
    LEFT JOIN core."siloType" AS "failSiloType"
    ON "failSiloType"."siloTypeId" = "failSilo"."siloTypeId"
    INNER JOIN core."trackRev"
    ON "trackRev"."trackRevId" = silo."trackRevId"
    INNER JOIN core."track"
    ON track."trackId" = "trackRev"."trackId"
    AND track."trackStatusId" IN (3)
    INNER JOIN core."entity_silo" AS es
    ON es."siloId" = "silo"."siloId"
    LEFT JOIN core."entity_silo" AS esx
    ON esx."parent_entity_silo_id" = es."entity_silo_id"
    WHERE ("ruleSetParams"->>'monitorSiloId')::INT IN (${ids})
    AND esx."parent_entity_silo_id" IS NULL
    ORDER BY "step"."priority"
  `)
  return rs.rows
}

async function findStuckEntities() {
  // returns silos, and their rulesets, that contain entities that appears to be stuck
  const rs = await knex.raw(`
    SELECT DISTINCT ON ("silo"."siloId")
    "silo"."trackRevId", "silo"."siloId", "track"."name" as "trackName",
    "silo"."name" AS "siloName",
    "silo"."descr" AS "siloDescr",
    "silo"."siloTypeId" AS "siloTypeId",
    "siloType"."name" AS "siloTypeName",
    "siloType"."descr" AS "siloTypeDescr",
    "failSilo"."name" AS "failSiloName",
    "failSilo"."descr" AS "failSiloDescr",
    "failSiloType"."siloTypeId" AS "failSiloTypeId",
    "failSiloType"."name" AS "failSiloTypeName",
    "failSiloType"."descr" AS "failSiloTypeDescr",
    "currentSilo"."name" AS "currentSiloName",
    "step"."ruleSetParams",
    "step"."stepId", "ruleSet".volt_query AS "voltQuery", "ruleSet".volt_query_key AS "voltQueryKey", "step"."ruleSetId", "step"."priority", "step"."onPassSiloId", "step"."currentSiloId", "step"."onFailSiloId"
    FROM core."entity_silo" AS es
    LEFT JOIN core."entity_silo" AS esx
    ON esx."parent_entity_silo_id" = es."entity_silo_id"
    INNER JOIN core."silo"
    ON silo."siloId" = es."siloId"
    INNER JOIN core."step"
    ON step."currentSiloId" = silo."siloId"
    LEFT JOIN core."silo" AS "failSilo"
    ON "failSilo"."siloId" = step."onFailSiloId"
    LEFT JOIN core."silo" AS "currentSilo"
    ON "currentSilo"."siloId" = step."currentSiloId"
    LEFT JOIN core."siloType" AS "failSiloType"
    ON "failSiloType"."siloTypeId" = "failSilo"."siloTypeId"
    LEFT JOIN core."entity_silo" AS "nextStepES"
    ON "nextStepES"."siloId" = step."onPassSiloId"
    AND "nextStepES"."entityId" = es."entityId"
    INNER JOIN core."ruleSet"
    ON "ruleSet"."ruleSetId" = step."ruleSetId"
    INNER JOIN core."siloType"
    ON "siloType"."siloTypeId" = silo."siloTypeId"
    INNER JOIN core."trackRev" AS tr
    ON tr."trackRevId" = "silo"."trackRevId"
    INNER JOIN core."track"
    ON "track"."trackId" = tr."trackId"
    AND "track"."trackStatusId" = 3
    INNER JOIN core."campaignRev"
    ON "campaignRev"."campaignRevId" = "track"."campaignRevId"
    INNER JOIN core."campaign"
    ON "campaign"."campaignId" = "campaignRev"."campaignId"
    WHERE esx."parent_entity_silo_id" IS NULL
    AND tr."deleted" IS NULL
    AND "campaignRev"."deleted" IS NULL
    AND silo."siloTypeId" IN (1, 2)
    AND es.created < (NOW() - INTERVAL '5 minutes')
    AND es.created > (NOW() - INTERVAL '72 hours')
    AND (step."onFailSiloId" IS NOT NULL
      OR "ruleSet".name = 'autoPass'
    )
    AND "ruleSet".scheduled = false
    AND "nextStepES"."siloId" IS NULL
    
  `)
  return rs.rows
}

export {
  getAllStarting,
  getAllScheduled,
  getBySilo,
  getAllMonitoring,
  findStuckEntities
}
