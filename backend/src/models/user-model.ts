import { Schema, model } from "mongoose";
import { isEmail } from "validator";
import { randomBytes, createHash } from "crypto";
import { compare } from "bcryptjs";
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

const tagSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	saveIds: {
		type: [Schema.Types.ObjectId],
		ref: "Save",
	},
})

const collectionSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String
	},
	saveIds: {
		type: [Schema.Types.ObjectId],
		ref: "Save",
	},
})

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
			default: [],
		},
    tags: {
			type: [tagSchema],
			select: false,
			default: [],
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
      validate: [isEmail, "Please provide a valid email"],
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
      minlength: [8, "Password must be longer than eight characters"],
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
			type: Object,
      enum: [{ user: 1 }, { admin: 2 }, { superuser: 3 }],
      default: { user: 1 },
			// select: false,
    },
    saves: {
			type: [userSaveSchema],
			default: [],
		},
		collections: {
			type: [collectionSchema],
			select: false,
			default: [],
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

userSchema.methods.isPasswordModified = function (
  JWTTimestamp: number
): boolean {
  if (this.passwordLastModified) {
    const timestamp = this.passwordLastModified.getTime() / 1000;
    return JWTTimestamp < timestamp;
  }
  return false;
};

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign({ id: this._id }, JWTSecret, {
    expiresIn: JWTExpiry,
  });
};

userSchema.methods.generateRefreshToken = async function (
  next: NextFunction
): Promise<void> {
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
