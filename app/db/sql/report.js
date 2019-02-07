const { connect } = require("../connect");

async function getTrack({ trackId, entityType }) {
  const knex = connect(entityType);
  const query = `
  SELECT es."siloId", silo."name", silo."descr", st."name" AS "siloTypeName", COUNT(es."entityId") AS "entityCount",
  date_trunc('second', MIN(es.created)) AS "Oldest Landing",
  date_trunc('second', MAX(es.created)) AS "Most recent Landing",
  to_char(justify_interval(date_trunc('second', age(CURRENT_TIMESTAMP, MIN(es.created)))), 'HH24:MI:SS') AS "Longest Dwell",
  to_char(justify_interval(date_trunc('second', age(CURRENT_TIMESTAMP, MAX(es.created)))), 'HH24:MI:SS') AS "Shortest Dwell"
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
  AND "campaignRev"."deleted" IS NULL
  AND tr."trackRevId" = ${trackId}
  GROUP BY es."siloId", silo."name", silo."descr", t."name", t."descr", st."name", "campaign"."name"
  ORDER BY "campaign"."name", t."name", es."siloId";
  `;
  const res = await knex.raw(query);
  return res.rows;
}

module.exports = {
  getTrack
};
