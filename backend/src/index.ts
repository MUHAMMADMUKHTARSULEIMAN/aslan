import express, { type NextFunction, type Request, type Response } from "express";
import globalErrorHandler from "./contollers/error-controller";
import CustomError from "./utils/custom-error";
import {router as discoveryRouter} from "./routers/discovery-router";
import {router as saveRouter} from "./routers/save-router"
import {router as feedRouter} from "./routers/feed-router"

const app = express();
export default app;

app.use(express.json())
app.use("/", feedRouter)
app.use("/", discoveryRouter)
app.use("/", saveRouter)

app.all("{/*path}", (req: Request, res: Response, next: NextFunction) => {
	const error = new CustomError(404, `Can't find ${req.originalUrl} on the server.`);
	next(error);
});

app.use(globalErrorHandler)
