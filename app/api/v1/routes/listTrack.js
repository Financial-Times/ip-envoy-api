const express = require("express");

const { listTrack } = require("../controllers/listTrackController");

const router = express.Router();

router.route("/").get(listTrack);
module.exports = router;
