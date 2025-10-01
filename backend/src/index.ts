import express, { type NextFunction, type Request, type Response } from "express";
import globalErrorHandler from "./contollers/error-controller";
import CustomError from "./utils/custom-error";
import {router as discoveryRouter} from "./routers/discovery-router";
import * as cheerio from "cheerio";

const app = express();
export default app;

app.use(express.json())
app.use("/", discoveryRouter)

app.all("{/*path}", (req: Request, res: Response, next: NextFunction) => {
	const error = new CustomError(404, `Can't find ${req.originalUrl} on the server.`);
	next(error);
});

app.use(globalErrorHandler)
