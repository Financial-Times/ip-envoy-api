const core = require("../../../core");
const logger = require('../../../logger')

async function deleteEntitiesFromJourney(req, res, next) {
  
  const { journeyName } = req.params;
  const { entities, entityType } = req.body;
  logger.warn({ journeyName, entities, entityType });

  try {
    const {rowCount, rows} = await core.entity.deleteFromJourney({
      journeyName,
      entities,
      entityType
    });
    const removedEntities = rows.map(r=>r.entityId);
    const outcome = `${rowCount} entitites were removed from journey: ${journeyName}. List=${removedEntities}`;
    logger.info(outcome);
    return res.status(200).json({
      data: { message: outcome }
    });
  } catch (err) {
    logger.error('Error deleting entities from journey: ' + err.message);
    logger.error(err);
    return next(err);
  }
}

module.exports = {
  deleteEntitiesFromJourney
};
