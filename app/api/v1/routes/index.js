const express = require("express");

const trackRoute = require("./track");
const reportRoute = require("./report");
const entityRoute = require("./entity");

// Top level router.
const router = express.Router();

// Resource specific routers.
router.use("/track", trackRoute);
router.use("/report", reportRoute);
router.use("/entity", entityRoute);

module.exports = router;
