const core = require('../core')

async function trackStatus(req, res, next) {
  try {
    const trackStatusList = await core.trackStatus.getStatus()
    return res.status(200).json({
      trackStatusList
    });
  } catch (e) {
    return next(e)
  }
}

module.exports = { trackStatus }
