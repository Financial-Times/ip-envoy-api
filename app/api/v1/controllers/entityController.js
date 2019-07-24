const core = require("../../../core");

async function deleteEntitiesFromTrack(req, res, next) {
  const { trackId } = req.params;
  const { entities, entityType } = req.body;

  try {
    const deletedRows = await core.entity.deleteFromTrack({
      trackId,
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
  deleteEntitiesFromTrack
};
