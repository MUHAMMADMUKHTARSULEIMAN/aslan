import mongoose from "mongoose";
import validator from "validator";
import crypto from "crypto";
import type { NextFunction } from "express";
import CustomError from "../utils/custom-error";
import type { IEmail } from "../types/email";
import config from "../config/config";

const { VERIFICATION_TOKEN_EXPIRY } = config;

const emailSchema = new mongoose.Schema<IEmail>(
  {
    email: {
      type: String,
      required: [true, "Email not provided"],
      unique: [true, "Email already in use"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      index: true,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiry: {
      type: Date,
			expires: VERIFICATION_TOKEN_EXPIRY
    },
  },
  { timestamps: true }
);

emailSchema.methods.generateVerificationToken = async function (
  next: NextFunction
): Promise<string | void> {
  const token = crypto.randomBytes(32).toString("hex");
  const verificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const email = await Emails.updateOne(
    { _id: this._id },
    {
      verificationToken,
      verificationTokenExpiry: Date.now() + (VERIFICATION_TOKEN_EXPIRY * 1000),
    }
  );

  if (!email) {
    const error = new CustomError(
      500,
      "Something went wrong. Try again later."
    );
    return next(error);
  }

  return token;
};

const Emails = mongoose.model("Email", emailSchema);
export default Emails;
