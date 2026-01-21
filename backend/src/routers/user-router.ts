import express, { type Request, Response, NextFunction } from "express";
import passport from "passport";
import {
  emailRegistration,
  forgotPassword,
  googleAuth,
  googleAuthCallback,
  linkAccount,
  resetPassword,
  userSignIn,
  userSignUp,
} from "../controllers/user-controller";
import rateLimit from "express-rate-limit";
import asyncErrorHandler from "../utils/async-error-handler";
import config from "../config/config";

const { WINDOW_MS, LIMIT } = config;

const limiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: LIMIT,
  legacyHeaders: false,
  standardHeaders: "draft-7",
  message: "Too many requests from this address. Try again later.",
  handler: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      return res.status(429).json({
        status: "Too Many Requests",
        message: "Rate limit exceeded. Wait a moment.",
      });
    }
  ),
});

export const router = express.Router();

router.route("/login/federated/google").get(
  googleAuth,
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router
  .route("/google/redirect")
  .get(passport.authenticate("google"), googleAuthCallback);

router.route("/link-account/:email").post(linkAccount);

router.route("/register-email").post(limiter, emailRegistration);

router.route("/sign-up/:email/:token").post(limiter, userSignUp);

router.route("/sign-in").post(limiter, userSignIn);

router.route("/forgot-password").get(limiter, forgotPassword);

router.route("/reset-password/:token").post(limiter, resetPassword);
