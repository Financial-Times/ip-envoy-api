const util = require("util");
const fs = require("fs");
const csv = require("fast-csv");
const {
  preParser,
  dbBuilder
} = require("@financial-times/ip-envoy-lucidimporter");

const core = require("../../../core");
const { connect } = require("../../../db/connect");
const unlink = util.promisify(fs.unlink); // TODO: implement the best strategy for removing the file.

async function listTracks(req, res, next) {
  try {
    const userTracks = await core.track.list("user");
    const anonTracks = await core.track.list("anon");
    const tracks = [...userTracks, ...anonTracks];

    return res.status(200).json({
      data: tracks
    });
  } catch (e) {
    return next(e);
  }
}

async function createTrack(req, res, next) {
  //const { preParser, dbBuilder } = lucidChart();
  const {
    file: { path }
  } = req;
  const { entityType, trackStatusId } = req.body;

  preParser.newCollection();

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
        if (await preParser.prepare(connect(entityType))) {
          await dbBuilder.make(
            preParser.lucidCollectionPreped,
            connect(entityType)
          );
        }

        const lastTrack = await core.track.getLast(entityType);
        const { trackId, name, descr } = lastTrack;
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

module.exports = {
  listTracks,
  getTrackById,
  createTrack,
  updateTrack
};
