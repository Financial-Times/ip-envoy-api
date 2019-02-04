const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

const upload = multer({ dest: "tmp/csv/" });

const {
  listTracks,
  getTrackById,
  updateTrack,
  createTrack
} = require("../controllers/trackController");

const router = express.Router();

router.route("/").get(listTracks);
router
  .use(upload.single("file"))
  .route("/upload")
  .post(createTrack);
router
  .route("/:trackId")
  .get(getTrackById)
  .patch(updateTrack);

module.exports = router;
