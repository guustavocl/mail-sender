import bodyParser from "body-parser";
import timeout from "connect-timeout";
import cookies from "cookie-parser";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { config } from "./config";
import { errorHandler } from "./middlewares/errors.middleware";
import { rateLimiter } from "./middlewares/limiter.middleware";
import { requestLogger } from "./middlewares/logger.middleware";
import { rules } from "./middlewares/rules.middleware";
import { router } from "./routes";
import logger from "./utils/logger";

const app = express();

mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    logger.info("Mongoose successfully connected!");
    runServer();
  })
  .catch(error => {
    logger.error(error, "Mongoose error");
  });

const runServer = () => {
  /* CONFIGS */
  app.use(timeout(config.timeout));
  app.use(bodyParser.json({ limit: config.requestSizeLimit }));
  app.use(bodyParser.urlencoded({ limit: config.requestSizeLimit, extended: true }));

  /* LOGGER */
  app.use(requestLogger());

  /* RULES & COOKIES */
  app.use(rules());
  app.use(cookies());

  /* APLICATION RATE LIMITER */
  app.use(rateLimiter());

  /*  ROUTES DECLARATION */
  app.use(router);

  /* ERROR HANDLING */
  app.use(errorHandler());

  http.createServer(app).listen(config.port, () => logger.info(`Server running on port ${config.port}`));
};
