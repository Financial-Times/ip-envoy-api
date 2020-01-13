const express = require("express");

const healthCheckRoute = require("./healthCheck");

// Top level router.
const router = express.Router();

// Resource specific routers.
router.use("/__health", healthCheckRoute);

module.exports = router;