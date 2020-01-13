const express = require("express");

const journeyRoute = require("./journey");
const reportRoute = require("./report");
const entityRoute = require("./entity");

// Top level router.
const router = express.Router();

// Resource specific routers.
router.use("/journey", journeyRoute);
router.use("/report", reportRoute);
router.use("/entity", entityRoute);

module.exports = router;
