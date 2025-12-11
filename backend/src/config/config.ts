import dotenv from "dotenv";
import getENVVariable from "../utils/get-env-variable";

dotenv.config();

interface Config {
	frontendBaseURL: string;
  nodeENV: string;
  port: number;
  mongodbURI: string;
  googleClientId: string;
  googleClientSecret: string;
	refreshTokenExpiry: number;
	resetTokenExpiry: number;
	verificationTokenExpiry: number;
	JWTSecret: string;
	JWTExpiry: number;
	cookieSecret: string;
	JWTCookieExpiry: number;
	refreshCookieExpiry: number;
	SMTPService: string;
	SMTPHost: string;
	SMTPPort: number;
	SMTPUser: string;
	SMTPPass: string;
	limitMs: number;
	maxRequests: number;
}

const config: Config = {
  frontendBaseURL: getENVVariable("FRONTEND_BASE_URL"),
  nodeENV: getENVVariable("NODE_ENV"),
  port: parseInt(getENVVariable("PORT")),
  mongodbURI: getENVVariable("MONGODB_URI"),
  googleClientId: getENVVariable("GOOGLE_CLIENT_ID"),
  googleClientSecret: getENVVariable("GOOGLE_CLIENT_SECRET"),
  refreshTokenExpiry: parseInt(getENVVariable("REFRESH_TOKEN_EXPIRY")),
  resetTokenExpiry: parseInt(getENVVariable("RESET_TOKEN_EXPIRY")),
  verificationTokenExpiry: parseInt(getENVVariable("VERIFICATION_TOKEN_EXPIRY")),
  JWTSecret: getENVVariable("JWT_SECRET"),
  JWTExpiry: parseInt(getENVVariable("JWT_EXPIRY")),
  cookieSecret: getENVVariable("COOKIE_SECRET"),
  JWTCookieExpiry: parseInt(getENVVariable("JWT_COOKIE_EXPIRY")),
  refreshCookieExpiry: parseInt(getENVVariable("REFRESH_COOKIE_EXPIRY")),
  SMTPService: getENVVariable("SMTP_SERVICE"),
  SMTPHost: getENVVariable("SMTP_HOST"),
  SMTPPort: parseInt(getENVVariable("SMTP_PORT")),
  SMTPUser: getENVVariable("SMTP_USER"),
  SMTPPass: getENVVariable("SMTP_PASS"),
  limitMs: parseInt(getENVVariable("LIMIT_MS")),
  maxRequests: parseInt(getENVVariable("MAX_REQUESTS")),
};

export default config;