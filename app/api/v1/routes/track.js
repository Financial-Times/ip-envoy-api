const express = require("express");

const { getById } = require("../controllers/trackController");

const router = express.Router();
router.route("/:trackId").get(getById);
// .patch(trackController.updateTrack)
// .post(postControllers);
// list latest Revision for by trackId
// router.route("/:trackId/latestRevision").get(trackController.getLatestRevision);

module.exports = router;
