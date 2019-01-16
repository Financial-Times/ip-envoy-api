const core = require('../core')

async function getById(req, res, next) {
  try {
    return res.status(200).json({
      trackRevId: req.params.trackRevId,
      track: await core.trackRev.getById(req.params.trackRevId)
    })
  } catch (e) {
    return next(e)
  }
}

async function patchTrack(req, res, next) {
  try {
    const trackId = req.params.trackRevId
    const savedRes = await core.trackRev.saveTrack(trackId, req.body.GUIData)
    return res.status(200).json({
      trackId: req.params.trackRevId,
      track: savedRes
    })
  } catch (e) {
    return next(e)
  }
}

async function patchTrackToDelete(req, res, next) {
  try {
    const trackId = req.params.trackId
    const { date, column, tableName } = req.body
    await core.trackRev.updateTrackRemoveDate(date, tableName, column, trackId)
    return res.status(200).json({
      date,
      trackId
    })
  } catch (e) {
    return next(e)
  }
}

async function deployTrack(req, res, next) {
  try {
    const deployRes = await core.trackRev.deployTrack(req.body.GUIData)
    return res.status(200).json({
      track: deployRes
    })
  } catch (e) {
    return next()
  }
}

module.exports = {
  getById,
  patchTrack,
  deployTrack,
  patchTrackToDelete
}
