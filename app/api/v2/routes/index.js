const express = require("express");

const journeyRoute = require("./journey");
const reportRoute = require("./report");
const entityRoute = require("./entity");
const actionRoute = require("./action");
const siloRoute = require("./silo");
const stepRoute = require("./step");

// Top level router.
const router = express.Router();

// Resource specific routers.
router.use("/journey", journeyRoute);
router.use("/report", reportRoute);
router.use("/entity", entityRoute);
router.use("/action", actionRoute);
router.use("/silo", siloRoute);
router.use("/step", stepRoute);

module.exports = router;
