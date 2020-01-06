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

async function listJourneys(req, res, next) {
  try {
    const userJourneys = await core.journey.list("user");
    const anonJourneys = await core.journey.list("anon");  
    const journeys = [...userJourneys, ...anonJourneys];

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
      } catch (e) {
        return next(e);
      }
    });
}

async function getJourneyById(req, res, next) {
  const { journeyId } = req.params;
  try {
    const entityType = "user"; // for now, just support the user db
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
