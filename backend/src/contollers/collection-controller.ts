import type { NextFunction, Request, Response } from "express";
import asyncErrorHandler from "../utils/async-error-handler";
import CustomError from "../utils/custom-error";
import Collections from "../models/collection-model";

export const getCollections = asyncErrorHandler(async(req: Request, res: Response, next: NextFunction) => {
	const collections = await Collections.find()
	
	res.status(200).json({
		status: "OK",
		data: {
			collections
		}
	})
})

export const createCollection = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const collection = await Collections.create(req.body);
    if (!collection) {
      const error = new CustomError(
        500,
        `Failed to create new collection. Try again later.`
      );
      return next(error);
    }
    res.status(201).json({
      status: "OK",
    });
  }
);

export const addArticlesToCollection = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const name = req.body.name;
    const urls = req.body.urls;

    const addedArticles = await Collections.updateOne(
      { name },
      { $push: { urls: { each: urls } } }
    );
    if (!addedArticles) {
      const error = new CustomError(
        500,
        `Failed to add ${
          urls.length === 1 ? "article" : "articles"
        }. Try again later.`
      );
      return next(error);
    }

    res.status(200).json({
      status: "OK",
    });
  }
);

export const editCollection = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const name = req.body.name;
    const newName = req.body?.newName;
    const newDescription = req.body?.newDescription;
    const removedURL = req.body?.url;

    if (newName && newDescription) {
      const editedCollection = await Collections.updateOne(
        { name },
        { $set: { name: newName, description: newDescription } }
      );
      if (!editedCollection) {
        const error = new CustomError(
          500,
          "Failed to change either of the name and the desription of the collection. Try again later."
        );
        return next(error);
      }
    } else {
      if (newName) {
        const editedCollection = await Collections.updateOne(
          { name },
          { $set: { name: newName } }
        );
        if (!editedCollection) {
          const error = new CustomError(
            500,
            "Failed to change the name of the collection. Try again later."
          );
          return next(error);
        }
      }
      if (newDescription) {
        const editedCollection = await Collections.updateOne(
          { name },
          { $set: { description: newDescription } }
        );
        if (!editedCollection) {
          const error = new CustomError(
            500,
            "Failed to change the description of the collection. Try again later."
          );
          return next(error);
        }
      }
    }

    if (removedURL) {
      const editedCollection = await Collections.updateOne(
        { name },
        { $pull: { urls: removedURL } }
      );
      if (!editedCollection) {
        const error = new CustomError(
          500,
          "Failed to remove article from collection. Try again later."
        );
        return next(error);
      }
    }

    res.status(200).json({
      status: "OK",
    });
  }
);

export const deleteCollection = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const name = req.body.Name;

    const deletedCollection = await Collections.deleteOne({ name });
    if (!deletedCollection) {
      const error = new CustomError(
        500,
        "Failed to delete collection. Try again later."
      );
      return next(error);
    }

    res.status(204).json({
      status: "OK",
    });
  }
);

// "Failed to change the name and the decription of the collection. Try again later"
