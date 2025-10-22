import type { NextFunction, Request, RequestHandler, Response } from "express";
import asyncErrorHandler from "../utils/async-error-handler";
import CustomError from "../utils/custom-error";
import config from "../config/config";
import { IUser } from "../types/user";
import passport from "passport";
import type { Info } from "../auth/passport-setup";
import Users from "../models/user-model";
import Emails from "../models/email-model";
import crypto from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";

const { frontendBaseURL, cookieExpiry, nodeENV, JWTSecret } = config;

export const signInResponse = async (
  user: IUser,
  res: Response,
  next: NextFunction,
  statusCode: number,
  message: string | undefined = undefined
) => {
  const token = user.generateAccessToken();
  await user.generateRefreshToken(next);

  res.cookie("jwt", token, {
    sameSite: "lax",
    signed: true,
    secure: nodeENV === "production",
    httpOnly: true,
    maxAge: cookieExpiry,
  });

  res.status(statusCode).json({
    status: "OK",
    message,
  });
};

export const googleAuthCallback = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "/google",
      { failureRedirect: "/login", session: false },
      async (err: Error | null, user: IUser | false, info?: Info) => {
        if (info?.message === "LINKING_REQUIRED") {
          const linkingId = info.linkingId;
          res.redirect(`/confirm-linking?linkingId=${linkingId}`);
        }

        if (!user) {
          res.status(401).json({
            status: "Bad Request",
            message: "Google Authentication failed",
          });
        }
      }
    );
  }
);

export const emailRegistration = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      const error = new CustomError(400, "Email not provided");
      return next(error);
    }

    const user = await Users.findOne({ email });

    if (user) {
      const error = new CustomError(409, "Email already in use.");
      return next(error);
    }

    const userEmail = await Emails.findOne({ email });
    if (userEmail) {
      // if (userEmail.isVerified) {
      //   const error = new CustomError(
      //     409,
      //     "Email already verified. Proceed to create account."
      //   );
      //   return next(error);
      // }

      const token = await userEmail.generateVerificationToken(next);
      // send verification link
      // send response indicating existence of email

      res.status(200).json({
        status: "OK",
        message: "Email verification resent. It will expire in five minutes",
        token,
      });
    }

    const newUserEmail = await Emails.create({ email });
    // send verification link
    // send response telling user to verify email using

    const token = await newUserEmail.generateVerificationToken(next);
    res.status(200).json({
      status: "OK",
      message: "Email verification sent. It will expire in five minutes",
      token,
    });
  }
);

export const userSignUp = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, password } = req.body;
    const { email, token } = req.query;

    if (!token) {
      const error = new CustomError(400, "Token missing.");
      return next(error);
    }

    const user = await Users.findOne({ email });
    if (user) {
      const error = new CustomError(409, "Email already in use.");
      return next(error);
    }

    if (typeof token === "string") {
      const verificationToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      const userEmail = await Emails.findOne({
        email,
        verificationToken,
        verificationTokenExpiry: { $gt: Date.now() },
      });
      if (!userEmail) {
        const error = new CustomError(
          404,
          "Verification token has expired. Please resend verification token."
        );
        return next(error);
      }
    }

    const newUser = await Users.create({
      email,
      firstName,
      lastName,
      password,
    });

    await signInResponse(
      newUser,
      res,
      next,
      201,
      "Account created and user signed in successfully."
    );
  }
);

export const userSignIn = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new CustomError(
        400,
        "Please provide an email and a password."
      );
      return next(error);
    }

    const user = await Users.findOne({ email });
    if (!user || !(await user?.comparePasswords(password))) {
      const error = new CustomError(400, "Invalid credentials.");
      return next(error);
    }

    await signInResponse(user, res, next, 201, "User signed in successfully.");
  }
);

export const refreshAccessToken = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.signedCookies.jwt;
    if (!token) {
      res.redirect("/sign-in");
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      res.redirect("/sign-in");
    }

    const encodedPayload = parts[1];
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf-8")
    );
    const exp: number = payload.exp;
    const user = await Users.findById(payload.id);
    if (exp && exp < Math.floor(Date.now() / 1000)) {
      if (!user) {
        res.redirect("/sign-in");
      } else {
        if (
          user.refreshTokenExpiry &&
          Date.now() < user.refreshTokenExpiry?.getTime()
        ) {
          const token = user.generateAccessToken();
          await user.generateRefreshToken(next);

          res.cookie("jwt", token, {
            sameSite: "lax",
            signed: true,
            secure: nodeENV === "production",
            httpOnly: true,
            maxAge: cookieExpiry,
          });
          next();
        } else {
					res.redirect("/sign-in")
				}
      }
    } else {
      next();
    }
  }
);

export const protectRoutes = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.signedCookies.jwt;
    if (!token) {
      res.redirect("/sign-in");
    }

    // @ts-expect-error
    const decodedToken = await promisify(jwt.verify)(token, JWTSecret);
    // @ts-expect-error
    const id = decodedToken.id;
    // @ts-expect-error
    const iat = decodedToken.iat;

    const user = await Users.findById(id);
    if (!user) {
      res.redirect("/sign-in");
    } else {
      if (user.isPasswordModified(iat)) {
        res.redirect("/sign-in");
      }

      req.user = user;
      next();
    }
  }
);
