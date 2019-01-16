const express = require("express");

const trackController = require("../controllers/trackController");

const router = express.Router();

module.exports = app => {
  /**
   * @swagger
   *
   * /track:
   *   get:
   *     description: Get all tracks
   *     responses:
   *       200:
   *         description: Success
   */
  router.route("/").get(trackController.list);
  /**
   * @swagger
   *
   * /track:
   *   get:
   *     summary: Adds a new pet to the store
   *     tags:
   *       - Track
   *     description: Get all tracks
   *     responses:
   *       200:
   *         description: Success
   */
  router
    .route("/:trackId")
    /**
     * @swagger
     *
     * /track/{trackId}:
     *   get:
     *     summary: Adds a new pet to the store
     *     tags:
     *       - Track
     *     description: Get track by id
     *     responses:
     *       200:
     *         description: Success
     */
    .get(trackController.getById)
    /**
     * @swagger
     *
     * /track/{trackId}:
     *   patch:
     *     summary: Adds a new pet to the store
     *     tags:
     *       - Track
     *     description: Update track by id
     *     responses:
     *       200:
     *         description: Success
     */
    .patch(trackController.updateTrack);
  //.post(postControllers)
  // // list latest Revision for by trackId
  router
    .route("/:trackId/latestRevision")
    /**
     * @swagger
     *
     * /track/{trackId}/latestRevision:
     *   get:
     *     summary: Adds a new pet to the store
     *     tags:
     *       - Track
     *     description: Get track last revision
     *     responses:
     *       200:
     *         description: Success
     */
    .get(trackController.getLatestRevision);
  app.use("/track", router);
};
