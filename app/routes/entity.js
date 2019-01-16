const express = require("express");

const { getEntityById } = require("../controllers/entityController");

const router = express.Router();

module.exports = app => {
  router.route("/:entityId").get(getEntityById);
  app.use("/entity", router);
};
