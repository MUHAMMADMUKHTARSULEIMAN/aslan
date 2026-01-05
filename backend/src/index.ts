import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./controllers/error-controller";
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
import helmet from "helmet";
import { refreshAccessToken } from "./controllers/user-controller";
import compression from "compression";
import hpp from "hpp";
import { doubleCsrf } from "csrf-csrf";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

const { cookieSecret, nodeENV, CSRFSecret, sessionSecret, mongodbURI } = config;

export const {
  generateCsrfToken,
  invalidCsrfTokenError,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: (req) => CSRFSecret,
  getSessionIdentifier: (req) => req.user?.id || req.session.id,
  cookieName:
    nodeENV === "production"
      ? "__Host-psifi.x-csrf-token"
      : "psifi.x-csrf-token",
  cookieOptions: {
    sameSite: "lax",
    secure: nodeENV === "production",
  },
  errorConfig: {
    message: "You're not authorized to perform this action.",
  },
});

const app = express();
export default app;


app.disable("X-powered-by");
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(cookieSecret));
app.use(
	session({
		secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
			secure: nodeENV === "production",
      sameSite: "lax",
      httpOnly: true,
    },
    store: MongoStore.create({
			mongoUrl: mongodbURI,
    }),
  })
);
initializeGooglePassport();
app.use("/api", userRouter, discoveryRouter);
app.use(refreshAccessToken);
app.use(doubleCsrfProtection);
app.use("/api", feedRouter);
app.use("/api/saves", saveRouter);
app.use("/api/saves/tags", tagRouter);
app.use("/api/saves/highlights", highlightRouter);
app.use("/api/collections", collectionRouter);

app.all("{/*path}", (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(
    404,
    `Can't find ${req.originalUrl} on the server.`
  );
  return next(error);
});

app.use(globalErrorHandler);
