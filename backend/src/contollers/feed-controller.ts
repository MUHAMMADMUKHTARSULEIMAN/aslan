import type { NextFunction, Request, Response } from "express";
import asyncErrorHandler from "../utils/async-error-handler";
import CustomError from "../utils/custom-error";
import Feeds from "../models/feed-model";
import Processor from "../utils/processor";

export const addFeedURL = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const url = req.body.url;
    const name = req.body.name;
		const processor = new Processor()

    if (!url) {
      const error = new CustomError(400, "A valid URL must be provided");
      return next(error);
    }

    const feed = await processor.fetchFeed(url);
    if (!feed) {
      const error = new CustomError(500, `unable to parse ${url}`);
      return next(error);
    }

		if(feed.items.length > 0 && feed.items[0].link) {
			const HTML = await processor.fetchHTML(feed.items[0].link)
			if(!HTML) {
				const error = new CustomError(500, `Unable to fetch HTML content from ${name}`)
				return next(error)
			}
			const article = processor.extractContent(HTML)
			if(!article) {
				const error = new CustomError(500, `Unable to extract content from document`)
				return next(error)
			}
		}
		else {
			const error = new CustomError(404, `No article was found in ${name}`)
			return next(error)
		}

    const entry = await Feeds.create(req.body);

    res.status(201).json({
      status: "OK",
      data: null,
    });
  }
);
