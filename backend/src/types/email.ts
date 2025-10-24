import type { NextFunction } from "express";
import { type Document } from "mongoose";

export interface IEmail extends Document {
	email: string;
	verificationToken?: string;
	verificationTokenExpiry?: Date;

	generateVerificationToken(next: NextFunction): Promise<string | void>;
}