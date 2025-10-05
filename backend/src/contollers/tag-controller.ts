import type { NextFunction, Request, Response } from "express";
import asyncErrorHandler from "../utils/async-error-handler";
import Tags from "../models/tag-model";
import CustomError from "../utils/custom-error";

const createTag = asyncErrorHandler(async(req: Request, res: Response, next: NextFunction) => {
	const tagsArray = []
	const tagsList = req.body.tags
	const url = req.body?.url

	for(let i = 0; i < tagsList.length; i++) {
		const tag = {
			name: tagsList[i],
			urls: [url]
		}
		tagsArray.push(tag)
	}
	if(tagsArray.length === 0) {
		const error = new CustomError(400, `New tags must be provided.`)
		return next(error)
	}
	const tags = Tags.create(tagsArray)
	if(!tags) {
		const error = new CustomError(500, `Failed to create ${tagsArray.length === 1 ? "a new tag" : "new tags"}. Try again later.`)
		return next(error)
	}
	res.status(201).json({
		status: "OK"
	})
})

const updateTag = asyncErrorHandler(async(req: Request, res: Response, next: NextFunction) => {
	const id = req.body.id
	
})

const deleteTag = asyncErrorHandler(async(req: Request, res: Response, next: NextFunction) => {

})