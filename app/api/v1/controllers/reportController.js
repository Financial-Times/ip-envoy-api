
const core = require("../../../core");

async function getEntityCountForTrackSilos(req, res, next) {
  const { trackId, trackName, entityType } = req.query;
  try {
    const report = await core.report.getEntityCountForTrackSilos({ trackId, trackName, entityType });
    return res.status(200).json({
      data: report
    });
  } catch (e) {
    return next(e);
  }
}

async function getVisitedTrackSilosForEntity(req, res, next) {
  const { entityId, trackId, trackName, entityType } = req.query;
  try {
    const report = await core.report.getVisitedTrackSilosForEntity({ entityId, trackId, trackName, entityType });
    return res.status(200).json({
      data: report
    });
  } catch (e) {
    return next(e);
  }
}

async function getEntitiesForSilo(req, res, next) {
  const { siloId, entityType, page = 1, size = 50 } = req.query;
  try {
    const report = await core.report.getEntitiesForSilo({ siloId, entityType, page: page - 1, size });
    return res.status(200).json({
      data: report
    });
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  getEntityCountForTrackSilos,
  getVisitedTrackSilosForEntity,
  getEntitiesForSilo
};
