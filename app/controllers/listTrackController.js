import core from '../core'
import logger from '../logger'

async function listTrack(req, res, next) {
  try {
    const list = await core.trackRev.getTrackList()
    return res.status(200).json({
      data: list
    })
    return next()
  } catch (e) {
    return next(e)
  }
}

export { listTrack }
