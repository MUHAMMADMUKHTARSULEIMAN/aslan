import dotenv from "dotenv";
import getENVVariable from "../utils/get-env-variable";

dotenv.config();

interface Config {
	nodeENV: string
	port: number
	mongodbURI: string
}

const config: Config = {
	nodeENV: getENVVariable("NODE_ENV"),
	port: parseInt(getENVVariable("PORT")),
	mongodbURI: getENVVariable("MONGODB_URI")
};

export default config;