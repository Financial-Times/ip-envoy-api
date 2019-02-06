const core = require("../../../core");

async function getTrackReport(req, res, next) {
  const { trackId } = req.params;
  const { entityType } = req.query;
  try {
    const trackReport = await core.report.getTrack({ trackId, entityType });
    return res.status(200).json({
      data: trackReport
    });
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  getTrackReport
};
