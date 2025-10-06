import type { NextFunction, Request, Response } from "express";
import asyncErrorHandler from "../utils/async-error-handler";
import Tags from "../models/tag-model";
import CustomError from "../utils/custom-error";
import Collections from "../models/collection-model";

export const createCollection = asyncErrorHandler(async(req: Request, res: Response, next: NextFunction) => {
	const collection = await Collections.create(req.body.name)
	if(!collection) {
		const error = new CustomError(500, `Failed to create new collection. Try again later.`)
		return next(error)
	}
	res.status(201).json({
		status: "OK"
	})
})

export const editCollection = asyncErrorHandler(async(req: Request, res: Response, next: NextFunction) => {

})


export const deleteCollection = asyncErrorHandler(async(req: Request, res: Response, next: NextFunction) => {

})