import type { NextFunction, Request, Response } from "express";
import asyncErrorHandler from "../utils/async-error-handler";
import CustomError from "../utils/custom-error";
import Collections from "../models/collection-model";

export const createCollection = asyncErrorHandler(async(req: Request, res: Response, next: NextFunction) => {
	const collection = await Collections.create(req.body)
	if(!collection) {
		const error = new CustomError(500, `Failed to create new collection. Try again later.`)
		return next(error)
	}
	res.status(201).json({
		status: "OK"
	})
})

export const addArticlesToCollection = asyncErrorHandler(async(req: Request, res: Response, next: NextFunction) => {
	const name = req.body.collection
	const urls = req.body.urls
	
	const addedArticles = await Collections.updateOne({name}, {$push: {urls: {each: urls}}})
	if(!addedArticles) {
		const error = new CustomError(500, `Failed to add ${urls.length === 1 ? "article" : "articles"}. Try again later.`)
		return next(error)
	}
	
	res.status(200).json({
		status: "OK"
	})
})

export const editCollection = asyncErrorHandler(async(req: Request, res: Response, next: NextFunction) => {
	const name = req.body.collection

})


export const deleteCollection = asyncErrorHandler(async(req: Request, res: Response, next: NextFunction) => {

})