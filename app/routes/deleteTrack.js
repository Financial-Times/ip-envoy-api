const express = require("express");

const cors = require("../middleware/cors");
const { patchTrackToDelete } = require("../controllers/trackRevController");

const router = express.Router();

module.exports = app => {
  router
    .use(cors)
    .route("/:trackId")
    /**
     * @swagger
     *
     * /deleteTrack/{trackId}:
     *   get:
     *     summary: Adds a new pet to the store
     *     tags:
     *       - DeleteTrck
     *     description: Get track revision
     *     responses:
     *       200:
     *         description: Success
     */
    .patch(patchTrackToDelete);
  app.use("/deleteTrack", router);
};
