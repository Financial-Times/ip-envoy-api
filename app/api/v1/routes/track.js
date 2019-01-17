const express = require("express");

const {
  getById,
  updateTrack,
  getLatestRevision
} = require("../controllers/trackController");

const router = express.Router();
router
  .route("/:trackId")
  .get(getById)
  .patch(updateTrack);

// .post(postControllers);
router.route("/:trackId/latestRevision").get(getLatestRevision);

module.exports = router;
