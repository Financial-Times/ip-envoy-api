
const core = require("../../../core");

async function getEntityCountForJourneySilos(req, res, next) {
  const { journeyId, journeyName, entityType } = req.query;
  try {
    const report = await core.report.getEntityCountForJourneySilos({ journeyId, journeyName, entityType });
    return res.status(200).json({
      data: report
    });
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  getEntityCountForJourneySilos
};
