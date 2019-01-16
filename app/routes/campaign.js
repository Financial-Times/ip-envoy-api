const express = require("express");

const { campaign } = require("../controllers/campaign");

const router = express.Router();

module.exports = app => {
  router
    .route("/")
    /**
     * @swagger
     *
     * /campaign:
     *   get:
     *     summary: Adds a new pet to the store
     *     tags:
     *       - Campaign
     *     description: Get track revision
     *     responses:
     *       200:
     *         description: Success
     */
    .get(campaign);
  app.use("/campaign", router);
};
