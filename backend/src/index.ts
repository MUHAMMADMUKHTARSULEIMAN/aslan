import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./contollers/error-controller";
import CustomError from "./utils/custom-error";
import { router as feedRouter } from "./routers/feed-router";
import { router as discoveryRouter } from "./routers/discovery-router";
import { router as userRouter } from "./routers/user-router";
import { router as saveRouter } from "./routers/save-router";
import { router as tagRouter } from "./routers/tag-router";
import { router as highlightRouter } from "./routers/highlight-router";
import { router as collectionRouter } from "./routers/collection-router";
import { initializeGooglePassport } from "./auth/passport-setup";
import config from "./config/config";

const { cookieSecret } = config;

const app = express();
export default app;

initializeGooglePassport();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(cookieSecret));
app.use(
  "/api",
  feedRouter,
  discoveryRouter,
  userRouter,
);
app.use("/api/saves", saveRouter)
app.use("/api/saves/tags", tagRouter)
app.use("/api/saves/highlights", highlightRouter)
app.use("/api/collections", collectionRouter)

app.all("{/*path}", (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(
    404,
    `Can't find ${req.originalUrl} on the server.`
  );
  next(error);
});

app.use(globalErrorHandler);
