import { Schema, model} from "mongoose";
import validator from "validator";
import { randomBytes, createHash } from "crypto";
import { compare, genSalt, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { IUser } from "../types/user";
import type { NextFunction } from "express";
import CustomError from "../utils/custom-error";

const { refreshTokenExpiry, resetTokenExpiry, JWTSecret, JWTExpiry } = config;

const highlightSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
			sparse: true,
    },
  },
  { timestamps: true }
);

const collectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
			sparse: true
    },
    description: {
      type: String,
    },
    saveIds: {
      type: [Schema.Types.ObjectId],
      ref: "Save",
    },
  },
  { timestamps: true }
);

const userSaveSchema = new Schema(
  {
    saveId: {
      type: Schema.Types.ObjectId,
      ref: "Save",
      required: true,
    },
    highlights: {
      type: [highlightSchema],
      select: false,
    },
    tags: {
      type: [tagSchema],
      select: false,
    },
    favourite: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

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
      validate: [validator.isEmail, "Please provide a valid email"],
      index: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      select: false,
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least eight characters"],
      required: function () {
        return !this.googleId;
      },
      select: false,
    },
    passwordLastModified: {
      type: Date,
      select: false,
    },
    resetToken: {
      type: String,
      select: false,
    },
    resetTokenExpiry: {
      type: Date,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    refreshTokenExpiry: {
      type: Date,
      select: false,
    },
    level: {
      type: Map,
      of: Number,
      enum: [{ user: 1 }, { admin: 2 }, { superuser: 3 }],
      default: { user: 1 },
    },
		linkingId: {
			type: Schema.Types.ObjectId
		},
    saves: {
      type: [userSaveSchema],
      select: false,
    },
    collections: {
      type: [collectionSchema],
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password") && this.password) {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePasswords = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  const isAMatch = await compare(candidatePassword, this.password);
  return isAMatch;
};

userSchema.methods.isPasswordModified = function (
  JWTTimestamp: number
): boolean {
  if (this.passwordLastModified) {
    const timestamp = this.passwordLastModified.getTime() / 1000;
    return JWTTimestamp < timestamp;
  } else {
		return false;
	}
};

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign({ id: this._id }, JWTSecret, {
    expiresIn: JWTExpiry,
  });
};

userSchema.methods.generateRefreshToken = async function (
  next: NextFunction
): Promise<string | void> {
  const token = randomBytes(32).toString("hex");
  const refreshToken = createHash("sha256").update(token).digest("hex");
  const user = await Users.updateOne(
    { _id: this._id },
    { refreshToken, refreshTokenExpiry: Date.now() + refreshTokenExpiry }
  );

  if (!user) {
    const error = new CustomError(
      500,
      "Something went wrong. Try again later."
    );
    return next(error);
  }

	return token
};

userSchema.methods.generateResetToken = async function (
  next: NextFunction
): Promise<string | void> {
  const token = randomBytes(20).toString("hex");
  const resetToken = createHash("sha256").update(token).digest("hex");
  const user = await Users.updateOne(
    { _id: this._id },
    { resetToken, resetTokenExpiry: Date.now() + resetTokenExpiry }
  );

  if (!user) {
    const error = new CustomError(
      500,
      "Something went wrong. Try again later."
    );
    return next(error);
  }

  return token;
};

const Users = model("User", userSchema);
export default Users;
