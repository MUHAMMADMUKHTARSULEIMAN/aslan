process.on("uncaughtException", (error: Error) => {
  logger(`${error.name}: ${error.message}`);
  logger("Uncaught exception occurred. Shutting down.");
  process.exit(1);
});

import mongoose from "mongoose";
import app from "./index";
import config from "./config/config";
import logger from "./utils/logger";

const { nodeENV, port, mongodbURI } = config;

mongoose
  .connect(mongodbURI)
  .then((conn) => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    logger(JSON.stringify(error));
  });

const server = app.listen(port, () => {
  console.log("Server has started.");
  console.log(nodeENV);
});

process.on("unhandledRejection", (error: Error) => {
  logger(`${error.name}: ${error.message}`);
  logger("Unhandled rejection occurred. Shutting down.");
  server.close(() => {
    process.exit(1);
  });
});
