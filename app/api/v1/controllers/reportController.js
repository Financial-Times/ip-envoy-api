const core = require("../../../core");

async function getEntityCountForTrackSilos(req, res, next) {
  const { trackId, entityType } = req.query;
  try {
    const report = await core.report.getTrack({ trackId, entityType });
    return res.status(200).json({
      data: report
    });
  } catch (e) {
    return next(e);
  }
}

async function getVisitedTrackSilosForEntity(req, res, next) {
  const { entityId, trackId, entityType } = req.query;
  try {
    const report = await core.report.getVisitedTrackSilosForEntity({ entityId, trackId, entityType });
    return res.status(200).json({
      data: report
    });
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  getEntityCountForTrackSilos,
  getVisitedTrackSilosForEntity
};
