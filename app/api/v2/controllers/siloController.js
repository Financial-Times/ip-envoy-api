const core = require("../../../core");

async function list(req, res, next) {
  try {
    const journeyId = req.query.journeyId;
    const silos = await core.silo.list({ entityType: "user", journeyId });
    return res.status(200).json({
      data: silos
    });
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  list
};
