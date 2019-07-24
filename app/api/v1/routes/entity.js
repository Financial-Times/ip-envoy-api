const express = require("express");
const bodyParser = require("body-parser");

const { deleteEntitiesFromTrack } = require("../controllers/entityController");

const router = express.Router();

router.route("/:trackId").delete(deleteEntitiesFromTrack);

module.exports = router;
