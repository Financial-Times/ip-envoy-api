const { promisify } = require("util");
const fs = require("fs");
const { initiateImport } = require('@financial-times/ip-envoy-lucidimporter');

const core = require("../../../core");
const { connect } = require("../../../db/connect");
const unlink = promisify(fs.unlink); // TODO: implement the best strategy for removing the file.

const initiateLucidImport = promisify(initiateImport);

async function listJourneys(req, res, next) {
  try {
    const userJourneys = await core.journey.list("user");
    const journeys = [...userJourneys];

    return res.status(200).json({
      data: journeys
    });
  } catch (e) {
    return next(e);
  }
}

async function createJourney(req, res, next) {
  const {
    file: { path }
  } = req;

  const { entityType, journeyStatusId } = req.body;

  await initiateLucidImport(path, connect(entityType))
  .then(async () => {
    const lastJourney = await core.journey.getLast(entityType);
    const { journeyId, descr } = lastJourney;
    const updatedJourney = await core.journey.updateJourney(
      journeyId,
      descr,
      journeyStatusId,
      entityType
    );
    return res.status(200).json({
      data: updatedJourney
    });
  })
  .catch(e => next(e))
}

async function getJourneyById(req, res, next) {
  const { journeyId } = req.params;
  try {
    const entityType = "user"; 
    const journey = await core.journey.getById(journeyId,entityType);
    return res.status(200).json({ data: journey });
  } catch (e) {
    return next(e);
  }
}

async function updateJourney(req, res, next) {
  const { journeyId } = req.params;
  const { descr, journeyStatusId, entityType } = req.body;
  console.warn({ descr, journeyStatusId, entityType });
  try {
    const updatedJourney = await core.journey.updateJourney(
      journeyId,
      descr,
      journeyStatusId,
      entityType
    );
    return res.status(200).json({
      data: updatedJourney
    });
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  listJourneys,
  getJourneyById,
  createJourney,
  updateJourney
};
