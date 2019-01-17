const core = require("../../../core");
const logger = require("../../../logger");

async function setCurrentRev(req, res, next) {
  try {
    if (!req.body.setCurrentTrackRev || isNaN(req.body.setCurrentTrackRev)) {
      return next();
    }

    if (req.body.setCurrentTrackRev === "") {
      // set to latest version
      const rs = await core.track.queryLatestRevision(req.params.trackId);

      await core.track.setCurrentRevById(
        req.params.trackId,
        rs.rows[0].trackRevId
      );

      res.status(200).json({
        trackId: req.params.trackId,
        newCurrentTrackRev: rs.rows[0].trackRevId,
        result: `Current track revision for track ${
          req.params.trackId
        } set to ${rs.rows[0].trackRevId}`
      });
    }

    await core.track.setCurrentRevById(
      req.params.trackId,
      req.body.setCurrentTrackRev
    );
    res.status(200).json({
      trackId: req.params.trackId,
      newCurrentTrackRev: req.body.setCurrentTrackRev,
      result: `Current track revision for track ${req.params.trackId} set to ${
        req.body.setCurrentTrackRev
      }`
    });
    return next();
  } catch (e) {
    return next(e);
  }
}

async function action(req, res, next) {
  try {
    if (!req.body.action) {
      return next();
    }
    if (!req.params.trackId) {
      return next(new Error("No trackId has been given"));
    }
    if (req.body.action === "start") {
      const err = await core.track.start(req.params.trackId);
      if (err) {
        return next(err);
      }
    }
    if (req.body.action === "update") {
      // pass
    }
    res.status(200).json({
      result: "ok"
    });
    return next();
  } catch (e) {
    return next(e);
  }
}

async function list(req, res, next) {
  try {
    res.status(200).json({
      tracks: await core.track.list()
    });
    next();
  } catch (e) {
    return next(e);
  }
}

async function getById(req, res, next) {
  try {
    const { trackId } =  req.params;
    const track = await core.track.getById(trackId)
    return res.status(200).json({ track });
  } catch (e) {
    return next(e);
  }
}

async function updateTrack(req, res, next) {
  const { trackId } = req.params;
  const { name, descr, statusId } = req.body;
  try {
    const updatedTrack = await core.track.updateTrack(
      trackId,
      name,
      descr,
      statusId
    );
    return res.status(200).json({
      data: updatedTrack
    });
  } catch (e) {
    return next(e);
  }
}

async function getLatestRevision(req, res, next) {
  core.track.queryLatestRevision();
  next();
}

module.exports = {
  list,
  getById,
  getLatestRevision,
  updateTrack,
  setCurrentRev,
  action
};
