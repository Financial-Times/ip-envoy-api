const core = require('../core')

async function postTrack(req, res, next) {
  const trackData = req.body;
  try {
    const savedTrack = await core.track.saveTrack(trackData)
    return res.status(200).json({
      data: savedTrack,
    })
  } catch (e) {
    return next(e)
  }
}

module.exports = { postTrack }
