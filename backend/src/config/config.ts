import dotenv from "dotenv";
import getENVVariable from "../utils/get-env-variable";

dotenv.config();

interface Config {
	FRONTEND_BASE_URL: string;
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
	REFRESH_TOKEN_EXPIRY: number;
	RESET_TOKEN_EXPIRY: number;
	VERIFICATION_TOKEN_EXPIRY: number;
	JWT_SECRET: string;
	JWT_EXPIRY: number;
	COOKIE_SECRET: string;
	JWT_COOKIE_EXPIRY: number;
	REFRESH_COOKIE_EXPIRY: number;
	SMTP_SERVICE: string;
	SMTP_HOST: string;
	SMTP_PORT: number;
	SMTP_USER: string;
	SMTP_PASS: string;
	WINDOW_MS: number;
	LIMIT: number;
	CSRF_SECRET: string;
	SESSION_SECRET: string;
}

const config: Config = {
  FRONTEND_BASE_URL: getENVVariable("FRONTEND_BASE_URL"),
  NODE_ENV: getENVVariable("NODE_ENV"),
  PORT: parseInt(getENVVariable("PORT")),
  MONGODB_URI: getENVVariable("MONGODB_URI"),
  GOOGLE_CLIENT_ID: getENVVariable("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getENVVariable("GOOGLE_CLIENT_SECRET"),
  REFRESH_TOKEN_EXPIRY: parseInt(getENVVariable("REFRESH_TOKEN_EXPIRY")),
  RESET_TOKEN_EXPIRY: parseInt(getENVVariable("RESET_TOKEN_EXPIRY")),
  VERIFICATION_TOKEN_EXPIRY: parseInt(getENVVariable("VERIFICATION_TOKEN_EXPIRY")),
  JWT_SECRET: getENVVariable("JWT_SECRET"),
  JWT_EXPIRY: parseInt(getENVVariable("JWT_EXPIRY")),
  COOKIE_SECRET: getENVVariable("COOKIE_SECRET"),
  JWT_COOKIE_EXPIRY: parseInt(getENVVariable("JWT_COOKIE_EXPIRY")),
  REFRESH_COOKIE_EXPIRY: parseInt(getENVVariable("REFRESH_COOKIE_EXPIRY")),
  SMTP_SERVICE: getENVVariable("SMTP_SERVICE"),
  SMTP_HOST: getENVVariable("SMTP_HOST"),
  SMTP_PORT: parseInt(getENVVariable("SMTP_PORT")),
  SMTP_USER: getENVVariable("SMTP_USER"),
  SMTP_PASS: getENVVariable("SMTP_PASS"),
  WINDOW_MS: parseInt(getENVVariable("WINDOW_MS")),
  LIMIT: parseInt(getENVVariable("LIMIT")),
  CSRF_SECRET: getENVVariable("CSRF_SECRET"),
  SESSION_SECRET: getENVVariable("SESSION_SECRET"),
};

export default config;