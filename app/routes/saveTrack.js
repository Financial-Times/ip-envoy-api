const express = require("express");

const { postTrack } = require("../controllers/trackSaveControler");

const router = express.Router();

module.exports = app => {
  router
    .route("/")
    /**
     * @swagger
     *
     * /saveTrack:
     *   get:
     *     summary: Adds a new pet to the store
     *     tags:
     *       - SaveTrack
     *     description: Get track revision
     *     responses:
     *       200:
     *         description: Success
     */
    .post(postTrack);
  app.use("/saveTrack", router);
};
