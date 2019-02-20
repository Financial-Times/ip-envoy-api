const express = require("express");

const trackRoute = require("./track");
const reportRoute = require("./report");
const svgRoute = require("./svg");

// Top level router.
const router = express.Router();

// Resource specific routers.
router.use("/track", trackRoute);
router.use("/report", reportRoute);
router.use("/svg", svgRoute);
//router.use("/__health", healthCheckkRoute);

module.exports = router;
