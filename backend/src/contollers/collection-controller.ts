import type { NextFunction, Request, Response } from "express";
import asyncErrorHandler from "../utils/async-error-handler";
import CustomError from "../utils/custom-error";
import Users from "../models/user-model";

export const getCollections = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const collections = await Users.find();

    res.status(200).json({
      status: "OK",
      data: {
        collections,
      },
    });
  }
);

export const createCollection = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      res.redirect("/sign-in");
    }

    const collection = await Users.updateOne(
      { _id: userId },
      { $push: { collections: req.body } }
    );
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

export const addSavesToCollection = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const collectionId = req.body.collectionId;
    const saveIds = req.body.saveIds;
    if (!userId) {
      res.redirect("/sign-in");
    }

    const addedArticles = await Users.updateOne(
      { _id: userId, "collections._id": collectionId },
      { $push: { "collections.saveIds": { each: saveIds } } }
    );
    if (!addedArticles) {
      const error = new CustomError(
        500,
        `Failed to add ${
          saveIds.length === 1 ? "article" : "articles"
        } to collection. Try again later.`
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
    const userId = req.user?._id;
    const collectionId = req.body.collectionId;
    const editQuery = req.body.updateQuery;
    const removedSaveIds = req.body?.saveIds;
    if (!userId) {
      res.redirect("/sign-in");
    }

    if (editQuery) {
      const dynamicSet: Record<string, any> = {};

      for (const key in editQuery) {
        if (Object.prototype.hasOwnProperty.call(editQuery, key)) {
          const editPath = `collections.$.${key}`;

          dynamicSet[editPath] = editQuery[key as keyof typeof editQuery];
        }
      }
      const editedCollection = await Users.updateOne(
        { _id: userId, "collections._id": collectionId },
        { $set: dynamicSet },
        {
          runValidators: true,
        }
      );
      if (!editedCollection) {
        const error = new CustomError(
          500,
          "Failed to change the name or the description of the collection. Try again later."
        );
        return next(error);
      }
    }

    if (removedSaveIds) {
      const editedCollection = await Users.updateOne(
        { _id: userId, "collections._id": collectionId },
        { $pull: { "collectiions.$.saveIds": { $in: removedSaveIds } } }
      );
      if (!editedCollection) {
        const error = new CustomError(
          500,
          `Failed to remove ${
            removedSaveIds.length === 1 ? "article" : "articles"
          } from collection. Try again later.`
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
    const userId = req.user?._id;
    const collectionId = req.body.collectionId;
    if (!userId) {
      res.redirect("/sign-in");
    }

    const deletedCollection = await Users.updateOne(
      { _id: userId, "collections._id": collectionId },
      { $pull: { collections: {_id: collectionId} } }
    );
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
