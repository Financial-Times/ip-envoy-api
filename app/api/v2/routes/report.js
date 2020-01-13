const express = require("express");

const {
  getEntityCountForJourneySilos
} = require("../controllers/reportController");

const router = express.Router();

router.route("/1").get(getEntityCountForJourneySilos);

module.exports = router;
