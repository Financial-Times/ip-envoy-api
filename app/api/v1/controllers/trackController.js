const csv = require("fast-csv");

const core = require("../../../core");
const { connect } = require("../../../db/connect");
const lucidChart = require("../../../db/import/lucidChart");

async function listTracks(req, res, next) {
  try {
    const userTracks = await core.track.list('user');
    const anonTracks = await core.track.list('anon');
    const tracks = [...userTracks, ...anonTracks];

    return res.status(200).json({
      data: tracks
    });
  } catch (e) {
    return next(e);
  }
}

async function createTrack(req, res, next) {
  const { preParser, dbBuilder } = lucidChart();
  const { file: { path } } = req;
  const { entityType, active} = req.body;

  csv
    .fromPath(path, { headers: true })
    .on("data", data => {
      preParser.have(data);
    })
    .on("error", e => {
      return next(e);
    })
    .on("end", async () => {
      try {
        // TODO: review this if else statement,
        if (await preParser.prepare(connect('user'))) {
          await dbBuilder.make(preParser.lucidCollectionPreped, connect('user'));
        }

        const lastTrack = await core.track.getLast(entityType);
        return res.status(200).json({
          data: lastTrack
        });
      } catch (e) {
        return next(e);
      }
    });
}

async function getTrackById(req, res, next) {
  const { trackId } = req.params;
  try {
    const track = await core.track.getById(trackId);
    return res.status(200).json({ data: track });
  } catch (e) {
    return next(e);
  }
}

async function updateTrack(req, res, next) {
  const { trackId } = req.params;
  const { name, descr, trackStatusId, entityType } = req.body;
  try {
    const updatedTrack = await core.track.updateTrack(
      trackId,
      name,
      descr,
      trackStatusId,
      entityType
    );
    return res.status(200).json({
      data: updatedTrack
    });
  } catch (e) {
    return next(e);
  }
}

async function getTrackLatestRevision(req, res, next) {
  const { trackId } = req.params;
  try {
    const latestRevision = await core.track.queryLatestRevision(trackId);
    return res.status(200).json({
      data: latestRevision
    });
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  listTracks,
  getTrackById,
  createTrack,
  updateTrack,
  getTrackLatestRevision
};
