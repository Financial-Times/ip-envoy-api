const express = require("express");

const {
  list
} = require("../controllers/siloController");

const router = express.Router();

router.route("/").get(list);

module.exports = router;
