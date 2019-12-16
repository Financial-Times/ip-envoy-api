
const core = require("../../../core");

async function getEntityCountForJourneySilos(req, res, next) {
  const { trackId, trackName, entityType } = req.query;
  try {
    const report = await core.report.getEntityCountForJourneySilos({ trackId, trackName, entityType });
    return res.status(200).json({
      data: report
    });
  } catch (e) {
    return next(e);
  }
}

async function getVisitedJourneySilosForEntity(req, res, next) {
  const { entityId, trackId, trackName, entityType } = req.query;
  try {
    const report = await core.report.getVisitedJourneySilosForEntity({ entityId, trackId, trackName, entityType });
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
  getEntityCountForJourneySilos,
  getVisitedJourneySilosForEntity,
  getEntitiesForSilo
};
