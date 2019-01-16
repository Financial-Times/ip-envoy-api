const { entity } = require("../core");
const logger = require("../logger");

async function getEntityById(req, res, next) {
  if (!req.params.entityId) {
    return next();
  }

  try {
    const result = await entity.get(req.params.entityId);
    res.status(200).json({
      result
    });
    return next();
  } catch (e) {
    return next(e);
  }
}

module.exports = { getEntityById };