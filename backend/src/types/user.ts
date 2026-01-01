import type { NextFunction } from "express";
import { type Document, type Types,} from "mongoose";

export interface IUser extends Document {
  firstName: string;
  email: string;
  level: {
		[key: string]: number
	};
  lastName?: string;
  googleId?: string;
  password?: string;
  passwordLastModified: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  refreshToken?: string;
  refreshTokenExpiry?: Date;
	linkingId: Types.ObjectId;
	saves: Document[];
	collections: Document[];

  comparePasswords(candidatePassword: string): Promise<boolean>;
  isPasswordModified(JWTTimestamp: number): boolean;
  generateAccessToken(): string;
  generateRefreshToken(next: NextFunction): Promise<string | void>;
  generateResetToken(next: NextFunction): Promise<string | void>;
}
