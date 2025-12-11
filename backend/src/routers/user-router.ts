import express, { type Request, Response, NextFunction } from "express";
import passport from "passport";
import {
  emailRegistration,
  forgotPassword,
  googleAuthCallback,
  linkAccount,
  refreshAccessToken,
  resetPassword,
  userSignIn,
  userSignUp,
} from "../contollers/user-controller";
import rateLimit from "express-rate-limit";
import asyncErrorHandler from "../utils/async-error-handler";
import config from "../config/config";

const {limitMs, maxRequests} = config


const limiter = rateLimit({
	windowMs: limitMs,
	max: maxRequests,
	legacyHeaders: false,
	standardHeaders: "draft-7",
	message: "Too many requests from this address. Try again later.",
	handler: asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
		res.status(429).json({
			status: "Too Many Requests",
			message: "Rate limit exceeded. Wait a moment."
		})
	})
});

export const router = express.Router();

router.route("/").all(refreshAccessToken);

router
  .route("/login/federated/google")
  .get(
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    })
  );

router.route("/google/redirect").get(googleAuthCallback);

router.route("/link-account/:linkingId").post(linkAccount);

router.route("/register-email").post(emailRegistration);

router.route("/sign-up/:email/:token").post(userSignUp);

router.route("/sign-in").post(userSignIn);

router.route("/forgot-password").get(forgotPassword);

router.route("/reset-password/:token").post(resetPassword);