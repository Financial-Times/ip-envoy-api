const express = require("express");
const bodyParser = require("body-parser");

const { getTrackReport } = require("../controllers/reportController");

const router = express.Router();

router.route("/track/:trackId").get(getTrackReport);

module.exports = router;
