const express = require("express");

const { trackStatus } = require("../controllers/trackStatus");

const router = express.Router();

module.exports = app => {
  router
    .route("/")
    /**
     * @swagger
     *
     * /trackStatus:
     *   get:
     *     summary: Adds a new pet to the store
     *     tags:
     *       - TrackStatus
     *     description: Get track revision
     *     responses:
     *       200:
     *         description: Success
     */
    .get(trackStatus);
  app.use("/trackStatus", router);
};
