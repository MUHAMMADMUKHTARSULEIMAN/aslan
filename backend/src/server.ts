process.on("uncaughtException", (error: Error) => {
  logger(`${error.name}: ${error.message}`);
  logger("Uncaught exception occurred. Shutting down.");
  process.exit(1);
});

import mongoose from "mongoose";
import app from "./index";
import config from "./config/config";
import logger from "./utils/logger";
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { NODE_ENV, PORT, MONGODB_URI} = config;


const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TLSOptions = {
  key: fs.readFileSync(path.join(__dirname, "../../certs/localhost+1-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../../certs/localhost+1.pem")),
};

mongoose
  .connect(MONGODB_URI)
  .then((conn) => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    logger(JSON.stringify(error));
  });

const server = https.createServer(TLSOptions, app);

server.listen(PORT, () => {
  console.log("Server has started.");
  console.log(NODE_ENV);
});

process.on("unhandledRejection", (error: Error) => {
  logger(`${error.name}: ${error.message}`);
  logger("Unhandled rejection occurred. Shutting down.");
  server.close(() => {
    process.exit(1);
  });
});
