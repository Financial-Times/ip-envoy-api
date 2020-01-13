const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

const upload = multer({ dest: "tmp/csv/" });

const {
  listJourneys,
  getJourneyById,
  updateJourney,
  createJourney
} = require("../controllers/journeyController");

const router = express.Router();

router.route("/").get(listJourneys);
router
  .use(upload.single("file"))
  .route("/upload")
  .post(createJourney);
router
  .route("/:journeyId")
  .get(getJourneyById)
  .patch(updateJourney);

module.exports = router;
