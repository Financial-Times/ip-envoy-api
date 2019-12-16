const core = require("../../../core");

async function deleteEntitiesFromJourney(req, res, next) {
  const { journeyId } = req.params;
  const { entities, entityType } = req.body;

  try {
    // SD TODO
    const deletedRows = await core.entity.deleteFromJourney({
      journeyId,
      entities,
      entityType
    });
    const [res1, res2] = deletedRows;
    return res.status(200).json({
      data: { message: `${res1.rowCount + res2.rowCount} rows were deleted` }
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  deleteEntitiesFromJourney
};
