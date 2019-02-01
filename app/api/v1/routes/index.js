const express = require("express");

const trackRoute = require("./track");

// Top level router.
const router = express.Router();

// Resource specific routers.
router.use("/track", trackRoute);
//router.use("/__health", healthCheckkRoute);

module.exports = router;
