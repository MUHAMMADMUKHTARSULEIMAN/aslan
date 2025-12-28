import type { NextFunction, Request, RequestHandler, Response } from "express";
import asyncErrorHandler from "../utils/async-error-handler";
import CustomError from "../utils/custom-error";
import config from "../config/config";
import { IUser } from "../types/user";
import passport from "passport";
import type { Info } from "../auth/passport-setup";
import Users from "../models/user-model";
import Emails from "../models/email-model";
import { createHash } from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import { getAndDeleteLink } from "./link-controller";
import sendEmail from "../utils/email";
import { generateCsrfToken } from "../index";

const {
  frontendBaseURL,
  JWTCookieExpiry,
  refreshCookieExpiry,
  nodeENV,
  JWTSecret,
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
    sameSite: "lax",
    signed: true,
    secure: nodeENV === "production",
    httpOnly: true,
    maxAge: JWTCookieExpiry,
  });

  res.cookie("refresh", refreshToken, {
    sameSite: "lax",
    signed: true,
    secure: nodeENV === "production",
    httpOnly: true,
    maxAge: refreshCookieExpiry,
  });

  sendEmail({
    email: user.email,
    subject: mailSubject,
    message: mailMessage,
    html: mailHTML,
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
        if (err) {
          const error = new CustomError(
            500,
            err?.message || "Something went wrong. Please try again later."
          );
          return next(error);
        }

        if (info?.message === "LINKING_REQUIRED") {
          const linkingId = info.linkingId;
          res.redirect(`/confirm-linking?linkingId=${linkingId}`);
        }

        if (!user) {
          res.status(401).json({
            status: "Bad Request",
            message: "Google Authentication failed.",
          });
        } else {
          const resetURL = `${frontendBaseURL}/`;
          const message = `Your Sanctum was just signed into using Google. If you did not perform this action, please use the link below to reset your password immediately.\n\n${resetURL}\n\nThis signs out all signed in users and a new sign-in is required to continue.`;
          const subject = "Sanctum: Google Sign-in";

          signInResponse(user, res, next, 201, subject, message);
        }
      }
    );
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
          400,
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

      res.status(201).json({
        status: "OK",
        message:
          "Verification link sent successfully. It expires in 15 minutes.",
      });
    } else {
			let userEmail = await Emails.findOne({ email });
			if (!userEmail) {
				userEmail = await Emails.create({ email });
			}
			
			const token = await userEmail.generateVerificationToken(next);
			const verificationUrl = `${frontendBaseURL}/sign-up/${email}/${token}`;
			const message = `Please use the link below to verify your email.\n\n${verificationUrl}\n\nThe link expires in 15 minutes.\n\nYou can safely ignore this email if you did not register your email at Sanctum.`;
			
			sendEmail({
				email,
				subject: "Sanctum: Email Verification",
				message,
				html: "",
			});
			
			res.status(201).json({
				status: "OK",
				message: "Verification link sent successfully. It expires in 15 minutes.",
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

    const newUser = await Users.create({
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
    }

    const resetURL = `${frontendBaseURL}/`;
    const message = `Your Sanctum was just signed into using your email address. If you did not perform this action, please use the link below to reset your password immediately.\n\n${resetURL}\n\nThis signs out all signed in users and a new sign-in is required to continue.`;
    const subject = "Sanctum: Email Sign-in";

    await signInResponse(user, res, next, 201, subject, message);
  }
);

export const refreshAccessToken = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const JWT = req.signedCookies.jwt;
    if (JWT) {
      next();
    }

    const token = req.signedCookies.refresh;
    if (token) {
      const refreshToken = createHash("sha256").update(token).digest("hex");

      const user = await Users.findOne({
        refreshToken,
        refreshTokenExpiry: { $gt: Date.now() },
      });
      if (!user) {
        next();
      } else {
        const newJWT = user.generateAccessToken();
        const newRefresh = await user.generateRefreshToken(next);

        res.cookie("jwt", newJWT, {
          sameSite: "lax",
          signed: true,
          secure: nodeENV === "production",
          httpOnly: true,
          maxAge: JWTCookieExpiry,
        });
        res.cookie("refresh", newRefresh, {
          sameSite: "lax",
          signed: true,
          secure: nodeENV === "production",
          httpOnly: true,
          maxAge: refreshCookieExpiry,
        });

        next();
      }
    } else {
      next();
    }
  }
);

export const protectRoutes = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const JWT = req.signedCookies.jwt;
    if (!JWT) {
      res.redirect("/sign-in");
    }

    // @ts-expect-error
    const decodedToken = await promisify(jwt.verify)(JWT, JWTSecret);
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

export const restrictUsers = (level: number): RequestHandler => {
  return asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      if (!user) {
        res.redirect("/sign-in");
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

      // send email with token
      const resetURL = `${frontendBaseURL}/reset-password/${token}`;
      const message = `Use the link below to reset your password. It expires in 10 minutes.\n\n${resetURL}\n\nIf you did not perform this action, you can safely ignore this email.\n\nAnd don't forget that we will never ask you for your password, a token or any other sensitive info. Thank you.`;

      sendEmail({
        email,
        subject: "Sanctum: Password Reset",
        message,
        html: "",
      });
    }

    res.status(200).json({
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
    res.status(200).json({
      status: "OK",
      data: {
        token: CSRFToken,
      },
    });
  }
);

export const testRoute = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
		res.status(200).json({
			status: "OK",
			message: "Finally back online"
		})
	}
);
