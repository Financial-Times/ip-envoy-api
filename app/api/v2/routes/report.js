const express = require("express");
const bodyParser = require("body-parser");

const {
  getEntityCountForJourneySilos,
  getVisitedJourneySilosForEntity,
  getEntitiesForSilo
} = require("../controllers/reportController");

const router = express.Router();

router.route("/1").get(getEntityCountForJourneySilos);
router.route("/2").get(getVisitedJourneySilosForEntity);
router.route("/3").get(getEntitiesForSilo);

module.exports = router;
