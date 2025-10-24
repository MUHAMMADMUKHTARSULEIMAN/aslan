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
	JWTSecret: string;
	JWTExpiry: number;
	cookieSecret: string;
	cookieExpiry: number;
	SMTPService: string;
	SMTPHost: string;
	SMTPPort: number;
	SMTPUser: string;
	SMTPPass: string;
}

const config: Config = {
  frontendBaseURL: getENVVariable("FRONTEND_BASE_URL"),
  nodeENV: getENVVariable("NODE_ENV"),
  port: parseInt(getENVVariable("PORT")),
  mongodbURI: getENVVariable("MONGODB_URI"),
  googleClientId: getENVVariable("GOOGLE_CLIENT_ID"),
  googleClientSecret: getENVVariable("GOOGLE_CLIENT_SECRET"),
  JWTSecret: getENVVariable("JWT_SECRET"),
  JWTExpiry: parseInt(getENVVariable("JWT_EXPIRY")),
  cookieSecret: getENVVariable("COOKIE_SECRET"),
  cookieExpiry: parseInt(getENVVariable("COOKIE_EXPIRY")),
  SMTPService: getENVVariable("SMTP_SERVICE"),
  SMTPHost: getENVVariable("SMTP_HOST"),
  SMTPPort: parseInt(getENVVariable("SMTP_PORT")),
  SMTPUser: getENVVariable("SMTP_USER"),
  SMTPPass: getENVVariable("SMTP_PASS"),
};

export default config;
