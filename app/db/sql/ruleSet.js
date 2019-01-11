import knex from '../../db/connect'

async function getRuleSteps() { // Get all steps and their rules. Loaded into the rules engine
  const rs = await knex.raw(`
    SELECT "step"."stepId", "step"."ruleSetParams", "ruleSet"."ruleSetId", "ruleSet"."name" AS "ruleSetName", "ruleSet"."scheduled"
    FROM core."step"
    INNER JOIN core."ruleSet"
    ON "ruleSet"."ruleSetId" = "step"."ruleSetId"
  `);
  return rs.rows
}

// takes a rulesetId and returns the ruleSet
async function get(ruleSetId) {
  const rs = await knex.raw(`
    SELECT "ruleSet"."ruleSetId", "ruleSet"."name" AS "ruleSetName", "rule"."conditions", "rule"."event", "rule"."priority", "ruleSet"."scheduled"
    FROM core."ruleSet"
    INNER JOIN core."rule"
    ON "rule"."ruleSetId" = "ruleSet"."ruleSetId"
    WHERE "rule"."ruleSetId" = ?;
  `, [ruleSetId])
  return rs.rows
}

export { getRuleSteps, get }
