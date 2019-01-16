const core = require('../../../core')
const logger = require('../../../logger')

async function listTrack(req, res, next) {
  try {
    const list = await core.trackRev.getTrackList()
    return res.status(200).json({
      data: list
    })
  } catch (e) {
    return next(e)
  }
}

module.exports = { listTrack }
