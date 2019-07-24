const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDocument = YAML.load("./swagger.yaml");
const logger = require("./logger");

const app = express();
const API_VERSION = "v1";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger UI settings.
const options = { explorer: true };
app.use(
  `/api/${API_VERSION}/docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, options)
);

// API public routes Settings.
app.use(`/api/${API_VERSION}`, require(`./api/${API_VERSION}/public`));

// API key middleware.
app.use((req, res, next) => {
  const header = req.get("x-api-key");
  if (!header || header !== process.env.ENVOY_API_KEY) {
    return res.status(401).send("Unauthorized request");
  }
  return next();
});

// API private routes Settings.
app.use(`/api/${API_VERSION}`, require(`./api/${API_VERSION}/routes`));

// Handle global uncaught async errors.
process.on("uncaughtException", err =>
  logger.error("global exception:", err.message)
);

// Handle unhandled global rejected promises.
// This will catch any unexpected exceptions inside `async` functions.
process.on("unhandledRejection", (reason, promise) =>
  logger.error("unhandled promise rejection:", reason.message || reason)
);

const port = process.env.PORT;
app.listen(port, err => {
  if (err) throw err;
  logger.info(`Server started on port ${port}`);
});
