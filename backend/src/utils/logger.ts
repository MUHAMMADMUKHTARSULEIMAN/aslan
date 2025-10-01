import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const logger = async (file: string | Buffer) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const relativePath = "../../log/log.txt";
  const absolutPath = path.resolve(__dirname, relativePath);
  fs.writeFile(absolutPath, file, { flag: "a" }, () => {});
};

export default logger;
