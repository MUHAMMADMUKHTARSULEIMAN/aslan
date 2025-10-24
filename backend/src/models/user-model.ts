import {Schema, model} from "mongoose";
import {isEmail} from "validator";
import {randomBytes, createHash} from "crypto";
import {compare} from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { IUser } from "../types/user";
import type { NextFunction } from "express";
import CustomError from "../utils/custom-error";

const { JWTSecret, JWTExpiry } = config;

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name not provided"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email not provided"],
      unique: [true, "Email already in use"],
      lowercase: true,
      validate: [isEmail, "Please provide a valid email"],
			index: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
			minlength: [8, "Password must be longer than eight characters"],
      required: function () {
        return !this.googleId;
      },
			select: false,
    },
		passwordLastModified: {
			type: Date,
		},
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
    refreshTokenExpiry: {
      type: Date,
    },
    level: {
      type: Object,
      enum: [{"user": 1}, {"admin": 2}, {"superuser": 3}],
      default: {"user": 1},
    },
  },
  { timestamps: true }
);

// userSchema.pre<IUser>("save", async function (next) {
//   if (this.isModified("password") && this.password) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   next();
// });

userSchema.methods.comparePasswords = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  const isAMatch = await compare(candidatePassword, this.password);
  return isAMatch;
};

userSchema.methods.isPasswordModified = function(JWTTimestamp: number): boolean {
	if(this.passwordLastModified) {
		const timestamp = this.passwordLastModified.getTime() / 1000
		return JWTTimestamp < timestamp
	}
	return false
}

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign({ id: this._id }, JWTSecret, {
    expiresIn: JWTExpiry,
  });
};

userSchema.methods.generateRefreshToken = async function (next: NextFunction): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const refreshToken = createHash("sha256").update(token).digest("hex");
  const user = await Users.updateOne(
    { _id: this._id },
    { refreshToken, refreshTokenExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000 }
  );

	if(!user) {
		const error = new CustomError(500, "Something went wrong. Try again later.")
		return next(error)
	}
};

userSchema.methods.generateResetToken = async function (next: NextFunction): Promise<string | void> {
  const token = randomBytes(20).toString("hex");
  const resetToken = createHash("sha256").update(token).digest("hex");
  const user = await Users.updateOne(
    { _id: this._id },
    { resetToken, resetTokenExpiry: Date.now() + 10 * 60 * 1000 }
  );

	if(!user) {
		const error = new CustomError(500, "Something went wrong. Try again later.")
		return next(error)
	}

  return token;
};

const Users = model("User", userSchema);
export default Users;
