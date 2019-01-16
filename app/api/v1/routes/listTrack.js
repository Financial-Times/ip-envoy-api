const express = require("express");

const { listTrack } = require("../controllers/listTrackController");

const router = express.Router();

router
  .route("/")
  /**
   * @swagger
   *
   * /listTrack:
   *   get:
   *     summary: Adds a new pet to the store
   *     tags:
   *       - ListTrack
   *     description: Get track revision
   *     parameters:
   *       - name: x-api-key
   *         in: header
   *         required: true
   *         description: |
   *           API authorization key
   *         schema:
   *           type: string
   *           format: uri
   *           example: example
   *     responses:
   *       '200':
   *         description:  Success | Track list successfully fetched
   *       '401':
   *         description: Error | Unauthorized request
   *       default:
   *         description: Error | Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Error"
   */
  .get(listTrack);

  module.exports = router;
