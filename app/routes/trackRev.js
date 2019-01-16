const express = require("express");

const cors = require("../middleware/cors");
const trackRevController = require("../controllers/trackRevController");

const router = express.Router();

module.exports = app => {
  router
    .use(cors)
    .route("/:trackRev")
    /**
     * @swagger
     *
     * /trackRev/{trackRevId}:
     *   patch:
     *     summary: Adds a new pet to the store
     *     tags:
     *       - TrackRev
     *     description: Update track revision
     *     responses:
     *       200:
     *         description: Success
     */
    .patch(trackRevController.patchTrack)
    /**
     * @swagger
     *
     * /trackRev/{trackRevId}:
     *   post:
     *     summary: Adds a new pet to the store
     *     tags:
     *       - TrackRev
     *     description: Deploy track
     *     responses:
     *       200:
     *         description: Success
     */
    .post(trackRevController.deployTrack)
    /**
     * @swagger
     *
     * /trackRev/{trackRevId}:
     *   get:
     *     summary: Adds a new pet to the store
     *     tags:
     *       - TrackRev
     *     description: Get track revision
     *     responses:
     *       200:
     *         description: Success
     */
    .get(trackRevController.getById);
  return app.use("/trackRev", router);
};
