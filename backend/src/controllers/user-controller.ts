import type { NextFunction, Request, RequestHandler, Response } from "express";
import asyncErrorHandler from "../utils/async-error-handler";
import CustomError from "../utils/custom-error";
import config from "../config/config";
import { IUser } from "../types/user";
import Users from "../models/user-model";
import Emails from "../models/email-model";
import { createHash } from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import { getAndDeleteLink } from "./link-controller";
import sendEmail from "../utils/email";
import { generateCsrfToken } from "../index";
import Sessions from "../models/session-model";

const {
  FRONTEND_BASE_URL,
  JWT_COOKIE_EXPIRY,
  REFRESH_COOKIE_EXPIRY,
  JWT_SECRET,
} = config;

export const signInResponse = async (
  user: IUser,
  res: Response,
  next: NextFunction,
  statusCode: number,
  mailSubject: string,
  mailMessage: string,
  message?: string,
  mailHTML?: string
) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken(next);

  res.cookie("jwt", accessToken, {
    sameSite: "none",
    signed: true,
    secure: true,
    httpOnly: true,
    maxAge: JWT_COOKIE_EXPIRY,
    path: "/",
  });

  res.cookie("refresh", refreshToken, {
    sameSite: "none",
    signed: true,
    secure: true,
    httpOnly: true,
    maxAge: REFRESH_COOKIE_EXPIRY,
    path: "/",
  });

  sendEmail({
    email: user.email,
    subject: mailSubject,
    message: mailMessage,
    html: mailHTML,
  });

  return res.status(statusCode).json({
    status: "OK",
    message,
  });
};

export const googleAuth = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const returnTo = (req.query.returnTo as string) || "/";

    const JWT = req.signedCookies.jwt || res.locals.jwt;
    const refresh = req.signedCookies.refresh || res.locals.refresh;

    if (JWT || refresh) {
      return res.redirect(`${FRONTEND_BASE_URL}${returnTo}`);
    } else {
      res.cookie("returnTo", returnTo, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        signed: true,
        path: "/",
      });
      next();
    }
  }
);

export const googleAuthCallback = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("connect.sid");

    const returnTo = req.signedCookies.returnTo || "/";
    res.clearCookie("returnTo");

    await Sessions.deleteOne({ _id: req.sessionID });
    req.session.destroy(() => {});

    const JWT = req.signedCookies.jwt || res.locals.jwt;
    const refresh = req.signedCookies.refresh || res.locals.refresh;

    if (JWT || refresh) {
      return res.redirect(`${FRONTEND_BASE_URL}${returnTo}`);
    } else {
      const user = req.user;
      if (!user) {
        return res.redirect(
          `${FRONTEND_BASE_URL}/sign-in?returnTo=${returnTo}`
        );
      } else {
        const linkingId = user.linkingId;
        if (linkingId) {
          return res.redirect(
            `${FRONTEND_BASE_URL}/confirm-linking/${user.email}/${linkingId}`
          );
        } else {
          const accessToken = user.generateAccessToken();
          const refreshToken = await user.generateRefreshToken(next);

          res.cookie("jwt", accessToken, {
            sameSite: "none",
            signed: true,
            secure: true,
            httpOnly: true,
            maxAge: JWT_COOKIE_EXPIRY,
            path: "/",
          });

          res.cookie("refresh", refreshToken, {
            sameSite: "none",
            signed: true,
            secure: true,
            httpOnly: true,
            maxAge: REFRESH_COOKIE_EXPIRY,
            path: "/",
          });

          const token = await user.generateResetToken(next);
          const resetURL = `${FRONTEND_BASE_URL}/reset-password/${token}`;
          const message = `Your Sanctum was just signed into using Google. If you did not perform this action, please use the link below to reset your password immediately.\n\n${resetURL}\n\nThis signs out all signed in users and a new sign-in is required to continue.`;
          const subject = "Sanctum: Google Sign-in";

          sendEmail({
            email: user.email,
            subject: subject,
            message: message,
          });

          return res.redirect(`${FRONTEND_BASE_URL}${returnTo}`);
        }
      }
    }
  }
);

export const linkAccount = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    const { linkingId } = req.params;
    if (!password) {
      const error = new CustomError(400, "Password must be provided.");
      return next(error);
    }

    if (!linkingId) {
      const error = new CustomError(400, "Linking ID missing.");
      return next(error);
    } else if (typeof linkingId === "string") {
      const linkingData = await getAndDeleteLink(linkingId);
      if (!linkingData) {
        const error = new CustomError(
          410,
          "Linking ID has expired. Try again later."
        );
        return next(error);
      } else {
        const { user, googleId } = linkingData;
        if (!(await user.comparePasswords(password))) {
          const error = new CustomError(400, "Wrong password provided.");
          return next(error);
        }
        const updatedUser = await user.updateOne({ googleId });
        if (!updatedUser) {
          const error = new CustomError(
            500,
            "Something went wrong. Try again later."
          );
          return next(error);
        }

        const message = `Your Sanctum account has been successfully linked to Google. You can now sign in to your Sanctum account using Google.`;
        const subject = "Sanctum: Account Linking";

        signInResponse(user, res, next, 201, subject, message);
      }
    }
  }
);

export const emailRegistration = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const returnTo = (req.query.returnTo as string) || "/";
    console.log(email);

    if (!email) {
      const error = new CustomError(400, "Email not provided.");
      return next(error);
    }

    const user = await Users.findOne({ email });

    if (user) {
      const message = `This email was just used to attempt to register an account with us. If you did not perform this action, you may be the target of a phishing attack.\n\nWe here at Sanctum take security very seriously and we will never ask you for your password, a token or any other sensitive info of any kind.`;

      sendEmail({
        email,
        subject: "Sanctum: Account Security",
        message,
        html: "",
      });

      return res.status(201).json({
        status: "OK",
        message:
          "Verification link sent successfully. It expires in 15 minutes.",
      });
    } else {
      let userEmail = await Emails.findOne({ email });
      if (!userEmail) {
        userEmail = await Emails.insertOne({ email });
      }

      const token = await userEmail.generateVerificationToken(next);
      const verificationUrl = `${FRONTEND_BASE_URL}/sign-up/${email}/${token}?returnTo=${returnTo}`;
      const message = `Please use the link below to verify your email.\n\n${verificationUrl}\n\nThe link expires in 15 minutes.\n\nYou can safely ignore this email if you did not register your email at Sanctum.`;

      sendEmail({
        email,
        subject: "Sanctum: Email Verification",
        message,
        html: "",
      });

      return res.status(201).json({
        status: "OK",
        message:
          "Verification link sent successfully. It expires in 15 minutes.",
        token,
      });
    }
  }
);

export const userSignUp = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, password } = req.body;
    const { email, token } = req.params;

    if (!token || !email) {
      const error = new CustomError(400, "Bad Request.");
      return next(error);
    }

    if (typeof token === "string") {
      const verificationToken = createHash("sha256")
        .update(token)
        .digest("hex");
      const userEmail = await Emails.findOneAndDelete({
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

    const user = await Users.findOne({ email });
    if (user) {
      const message = `An attempt was made to re-verify this already verified email address. If you did not perform this action, you may be the target of a phishing attack.\n\nWe here at Sanctum take security very seriously and we will never ask you for your password, a token or any other sensitive info of any kind.`;

      sendEmail({
        email: user.email,
        subject: "Sanctum: Account Security",
        message,
        html: "",
      });
      const error = new CustomError(
        409,
        "Verification token has expired. Please resend verification token."
      );
      return next(error);
    }

    const newUser = await Users.insertOne({
      email,
      firstName,
      lastName,
      password,
    });

    if (!newUser) {
      const error = new CustomError(
        500,
        "Unable to create account. Please try again."
      );
      return next(error);
    }

    const message = `Hi.\n\nYour Sanctum account has been successfully created and you have been successfully signed in.\n\nWelcome aboard.`;
    const subject = "Sanctum: Account Creation";
    const responseMessage =
      "Your account has been successfully created and you have been signed in.";

    await signInResponse(
      newUser,
      res,
      next,
      201,
      subject,
      message,
      responseMessage
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
    } else {
      const token = await user.generateResetToken(next);

      const resetURL = `${FRONTEND_BASE_URL}/reset-password/${token}`;
      const message = `Your Sanctum was just signed into using your email address. If you did not perform this action, please use the link below to reset your password immediately.\n\n${resetURL}\n\nThis signs out all signed in users and a new sign-in is required to continue.`;
      const subject = "Sanctum: Email Sign-in";

      await signInResponse(user, res, next, 201, subject, message);
    }
  }
);

export const refreshAccessToken = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const JWT = req.signedCookies.jwt;
    if (JWT) {
      next();
    } else {
      const token = req.signedCookies.refresh;
      if (token) {
        const refreshToken = createHash("sha256").update(token).digest("hex");

        const user = await Users.findOne({
          refreshToken,
          refreshTokenExpiry: { $gt: Date.now() },
        });
        if (!user) {
					res.clearCookie("refresh");
          next();
        } else {
          const newJWT = user.generateAccessToken();
          const newRefresh = await user.generateRefreshToken(next);

          res.locals.jwt = newJWT;
          res.locals.refresh = newRefresh;

          res.cookie("jwt", newJWT, {
            sameSite: "none",
            signed: true,
            secure: true,
            httpOnly: true,
            maxAge: JWT_COOKIE_EXPIRY,
            path: "/",
          });

          res.cookie("refresh", newRefresh, {
            sameSite: "none",
            signed: true,
            secure: true,
            httpOnly: true,
            maxAge: REFRESH_COOKIE_EXPIRY,
            path: "/",
          });

          next();
        }
      } else {
        next();
      }
    }
  }
);

export const protectRoutes = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const JWT = req.signedCookies.jwt;
    if (!JWT) {
      return res.redirect(`${FRONTEND_BASE_URL}/sign-in`);
    }

    // @ts-expect-error
    const decodedToken = await promisify(jwt.verify)(JWT, JWT_SECRET);
    // @ts-expect-error
    const id = decodedToken.id;
    // @ts-expect-error
    const iat = decodedToken.iat;

    const user = await Users.findById(id);
    if (!user || user.isPasswordModified(iat)) {
      return res.redirect(`${FRONTEND_BASE_URL}/sign-in`);
    } else {
      req.user = user;
      next();
    }
  }
);

export const restrictUsers = (level: number): RequestHandler => {
  return asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      if (!user) {
        return res.redirect(`${FRONTEND_BASE_URL}/sign-in`);
      } else {
        const key = Object.keys(user.level)[0];
        if (user.level[key] < level) {
          const error = new CustomError(
            403,
            "You're not authorized to perform this action."
          );
          return next(error);
        }

        next();
      }
    }
  );
};

export const forgotPassword = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
      const error = new CustomError(400, "Email not provided.");
      return next(error);
    }

    const user = await Users.findOne({ email });
    if (!user) {
      // send email alerting user of possible phishing scam
      const message = `This email is not registered with Sanctum, but a password reset was just requested. If you did not perform this action, you may be the target of a phishing attack.\n\nWe here at Sanctum take security very seriously and we will never ask you for your password, a token or any other sensitive info of any kind.`;

      sendEmail({
        email,
        subject: "Sanctum: Account Security",
        message,
        html: "",
      });
    } else {
      const token = await user.generateResetToken(next);

      const resetURL = `${FRONTEND_BASE_URL}/reset-password/${token}`;
      const message = `Use the link below to reset your password. It expires in 10 minutes.\n\n${resetURL}\n\nIf you did not perform this action, you can safely ignore this email.\n\nAnd don't forget that we will never ask you for your password, a token or any other sensitive info. Thank you.`;

      sendEmail({
        email,
        subject: "Sanctum: Password Reset",
        message,
        html: "",
      });
    }

    return res.status(200).json({
      status: "OK",
      message:
        "Password reset link sent successfully. It expires in 10 minutes.",
    });
  }
);

export const resetPassword = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    const { token } = req.params;
    if (!password) {
      const error = new CustomError(400, "Password not provided.");
      return next(error);
    }
    if (!token) {
      const error = new CustomError(400, "Token missing.");
      return next(error);
    } else {
      if (typeof token === "string") {
        const resetToken = createHash("sha256").update(token).digest("hex");
        const user = await Users.findOne({
          resetToken,
          resetTokenExpiry: { $gt: Date.now() },
        });
        if (!user) {
          const error = new CustomError(
            400,
            "Reset token has expired. Resend reset token."
          );
          return next(error);
        } else {
          const updatedUser = await user.updateOne({ password });
          if (!updatedUser) {
            const error = new CustomError(
              500,
              "Unable to update password. Try again later."
            );
            return next(error);
          }

          const message = `Your Sanctum password has been successfully reset and all previously signed in users have been signed out. You have also been signed into your new device.`;
          const subject = "Sanctum: Password Reset";

          signInResponse(user, res, next, 201, subject, message);
        }
      }
    }
  }
);

export const getCSRFToken = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const CSRFToken = generateCsrfToken(req, res);
    return res.status(200).json({
      status: "OK",
      data: {
        token: CSRFToken,
      },
    });
  }
);
