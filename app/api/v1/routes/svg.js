const express = require("express");
const bodyParser = require("body-parser");

const { getSvg } = require("../controllers/svgController");

const router = express.Router();

router.route("/").get(getSvg);

module.exports = router;
