import express from "express";
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