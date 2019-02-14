const express = require("express");
const bodyParser = require("body-parser");

const {
  getEntityCountForTrackSilos,
  getVisitedTrackSilosForEntity,
  getEntitiesForSilo
} = require("../controllers/reportController");

const router = express.Router();

router.route("/1").get(getEntityCountForTrackSilos);
router.route("/2").get(getVisitedTrackSilosForEntity);
router.route("/3").get(getEntitiesForSilo);

module.exports = router;
