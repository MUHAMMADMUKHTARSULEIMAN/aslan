import type { NextFunction } from "express";
import { type Document } from "mongoose";

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

  comparePasswords(candidatePassword: string): Promise<boolean>;
  isPasswordModified(JWTTimestamp: number): boolean;
  generateAccessToken(): Promise<string | void>;
  generateRefreshToken(next: NextFunction): Promise<string | void>;
}

// export interface IAuthResponse {
//   message: string;
//   accessToken: string;
//   refreshToken: string;
//   user: {
//     id: string;
//     email: string;
//   };
// }
