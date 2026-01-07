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

const {
  COOKIE_SECRET,
  NODE_ENV,
  CSRF_SECRET,
  SESSION_SECRET,
  MONGODB_URI,
  FRONTEND_BASE_URL,
} = config;

export const {
  generateCsrfToken,
  invalidCsrfTokenError,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: (req) => CSRF_SECRET,
  getSessionIdentifier: (req) => req.user?.id || req.session.id,
  cookieName:
    NODE_ENV === "production"
      ? "__Host-psifi.x-csrf-token"
      : "psifi.x-csrf-token",
  cookieOptions: {
    sameSite: "none",
    secure: true,
    path: "/",
  },
  errorConfig: {
    message: "You're not authorized to perform this action.",
  },
});

const app = express();
export default app;

app.disable("X-powered-by");

app.use(
  cors({
    origin: FRONTEND_BASE_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("{/*path}", cors());
app.use(compression());
app.use(helmet());
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      path: "/",
    },
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
    }),
  })
);
initializeGooglePassport();
app.use("/api", userRouter);
app.use(refreshAccessToken);
app.use(doubleCsrfProtection);
app.use("/api", discoveryRouter, feedRouter);
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
