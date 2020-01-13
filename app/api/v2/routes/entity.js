const express = require("express");
const bodyParser = require("body-parser");

const { deleteEntitiesFromJourney } = require("../controllers/entityController");

const router = express.Router();

router.route("/:journeyId").delete(deleteEntitiesFromJourney);

module.exports = router;
