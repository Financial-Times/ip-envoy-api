const { connect } = require("../connect");

async function getEntityCountForTrackSilos({ trackId, trackName, entityType }) {
  const knex = connect(entityType);
  let query = `
    SELECT es."siloId", silo."name", silo."descr", st."name" AS "siloTypeName", COUNT(es."entityId") AS "entityCount",
    date_trunc('second', MIN(es.created)) AS "Oldest Landing",
    date_trunc('second', MAX(es.created)) AS "Most recent Landing",
    justify_interval(date_trunc('second', age(CURRENT_TIMESTAMP, MIN(es.created)))) AS "Longest Dwell",
    justify_interval(date_trunc('second', age(CURRENT_TIMESTAMP, MAX(es.created)))) AS "Shortest Dwell"
    FROM core."entity_silo" AS es
    LEFT JOIN core."entity_silo" AS esx
    ON esx."parent_entity_silo_id" = es."entity_silo_id"
    INNER JOIN core."silo"
    ON silo."siloId" = es."siloId"
    INNER JOIN core."siloType" AS st
    ON st."siloTypeId" = silo."siloTypeId"
    INNER JOIN core."trackRev" AS tr
    ON tr."trackRevId" = "silo"."trackRevId"
    INNER JOIN core."track" AS t
    ON t."trackId" = tr."trackId"
    INNER JOIN core."campaignRev"
    ON "campaignRev"."campaignRevId" = t."campaignRevId"
    INNER JOIN core."campaign"
    ON "campaign"."campaignId" = "campaignRev"."campaignId"
    WHERE esx."parent_entity_silo_id" IS NULL
    AND tr."deleted" IS NULL
    AND "campaignRev"."deleted" IS NULL `;
  if (trackId) {
    query += `AND tr."trackRevId" = ${trackId} `;
  } else {
    query += `AND t."name" = '${trackName}' `;
  }
  query += `GROUP BY es."siloId", silo."name", silo."descr", t."name", t."descr", st."name", "campaign"."name"
      ORDER BY "campaign"."name", t."name", es."siloId";
  `;
  console.warn(query);
  const res = await knex.raw(query);
  return res.rows;
}

async function getVisitedTrackSilosForEntity({
  entityId,
  trackId,
  trackName,
  entityType
}) {
  const knex = connect(entityType);
  let query = `
    SELECT "entityId", es."created" AS "timestamp", es."siloId", es."lastStepId",
    rs.name AS ruleSetName, rs.descr AS ruleSetDescr, t.name AS "trackName", s.name, s.descr,
    justify_interval(date_trunc('second', age(es."created",
    (
      SELECT MIN(created)
      FROM core."entity_silo"
      INNER JOIN core.silo
      ON silo."siloId" = "entity_silo"."siloId"
      WHERE silo."trackRevId" = s."trackRevId"
      AND "entity_silo"."entityId" = es."entityId"
    )))) AS "Time in Journey"
    FROM core."entity_silo" AS es
    INNER JOIN core."step" AS st
    ON es."lastStepId" = st."stepId"
    INNER JOIN core."ruleSet" AS rs
    ON rs."ruleSetId" = st."ruleSetId"
    INNER JOIN core."silo" AS s
    ON s."siloId" = es."siloId"
    INNER JOIN core."trackRev" AS tr
    ON tr."trackRevId" = s."trackRevId"
    INNER JOIN core."track" AS t
    ON t."trackId" = tr."trackRevId"
      WHERE "entityId" = '${entityId}' `;
  if (trackId) {
    query += `AND s."trackRevId" = ${trackId} `;
  } else {
    query += `AND t."name" = '${trackName}' `;
  }
  query += `ORDER BY "entityId", es."created";`;
  const res = await knex.raw(query);
  return res.rows;
}

async function getEntitiesForSiloCount({ siloId, entityType }) {
  const knex = connect(entityType);
  const query = `
    SELECT COUNT(*)
    FROM core."entity_silo" AS es
    LEFT JOIN core."entity_silo" AS esx
    ON esx."parent_entity_silo_id" = es."entity_silo_id"
    WHERE esx."parent_entity_silo_id" IS NULL
    AND es."siloId" = ${siloId};
  `;
  const res = await knex.raw(query);
  return res.rows[0].count;
}

async function getEntitiesForSilo({ siloId, entityType, page, size }) {
  const knex = connect(entityType);
  const query = `
    SELECT es."entity_silo_id", es."entityId", es."entityTypeName", es."siloId"
    FROM core."entity_silo" AS es
    LEFT JOIN core."entity_silo" AS esx
    ON esx."parent_entity_silo_id" = es."entity_silo_id"
    WHERE esx."parent_entity_silo_id" IS NULL
    AND es."siloId" = ${siloId} LIMIT ${size} OFFSET ${page};
  `;
  const res = await knex.raw(query);
  return res.rows;
}

async function getEntityCountForJourneySilos({ journeyId, journeyName, entityType }) {
  const knex = connect(entityType);

  if (!journeyName) {
    console.warn('journeyName param not provided to getEntityCountForJourneySilos, so looking it up in DB');
    journeyName = await getJourneyNameFromId(journeyId,entityType);
    console.warn({journeyName});
  }

  const res = await knex.raw(`
  select s."siloId",s."name",s.descr,st."name" AS "siloTypeName","entityCount","Oldest Landing","Most recent Landing","Longest Dwell","Shortest Dwell"
  from core.silo s
  inner join core.journey j
    on s."journeyId" = j."journeyId"
  INNER JOIN core."siloType" AS st
    ON st."siloTypeId" = s."siloTypeId"
  inner join 
    (
    SELECT count("entityId") as "entityCount", "siloId",
      date_trunc('second', MIN(silo.created)) AS "Oldest Landing",
      date_trunc('second', MAX(silo.created)) AS "Most recent Landing",
      justify_interval(date_trunc('second', age(CURRENT_TIMESTAMP, MIN(silo.created)))) AS "Longest Dwell",
      justify_interval(date_trunc('second', age(CURRENT_TIMESTAMP, MAX(silo.created)))) AS "Shortest Dwell"
    FROM core.entity_journey_progression,
      jsonb_to_record(jsonData->:journeyName->-1) AS silo("siloId" INT, "siloName" VARCHAR, created TIMESTAMP)
      WHERE jsonData \\?| array[:journeyName]
    group by "siloId"
    ) populated_silos
    
    on s."siloId" = populated_silos."siloId"
  
  where j."name" = :journeyName
  ;
  `, {journeyName});

  return res.rows;
}

async function getJourneyNameFromId(journeyId, entityType) {
  const knex = connect(entityType);
  const journeyNameRes = await knex.raw(`
  select "name" from core.journey where "journeyId" = :journeyId ; 
  `, {journeyId});
  return journeyNameRes.rows[0]['name'];
}


module.exports = {
  getEntityCountForTrackSilos,
  getVisitedTrackSilosForEntity,
  getEntitiesForSiloCount,
  getEntitiesForSilo,
  getEntityCountForJourneySilos
};
