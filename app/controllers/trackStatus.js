import core from '../core'

async function trackStatus(req, res, next) {
  try {
    const trackStatusList = await core.trackStatus.getStatus()
    res.status(200).json({
      trackStatusList
    });
    return next()
  } catch (e) {
    return next(e)
  }
}

export { trackStatus }
