const core = require("../../../core");

async function deleteEntitiesFromJourney(req, res, next) {
  
  const { journeyName } = req.params;
  const { entities, entityType } = req.body;
  console.warn({ journeyName, entities, entityType });

  try {
    const {rowCount, rows} = await core.entity.deleteFromJourney({
      journeyName,
      entities,
      entityType
    });
    const removedEntities = rows.map(r=>r.entityId);
    return res.status(200).json({
      data: { message: `${rowCount} entitites were removed from journey: ${journeyName}. List=${removedEntities}` }
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  deleteEntitiesFromJourney
};
