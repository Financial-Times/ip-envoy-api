import core from '../core'

async function postTrack(req, res, next) {
  const trackData = req.body;
  try {
    const savedTrack = await core.track.saveTrack(trackData)
    res.status(200).json({
      data: savedTrack,
    })
    return next()
  } catch (e) {
    return next(e)
  }
}

export { postTrack }
