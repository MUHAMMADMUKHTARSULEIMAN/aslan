import type { NextFunction, Request, Response } from "express";
import asyncErrorHandler from "../utils/async-error-handler";
import CustomError from "../utils/custom-error";
import Users from "../models/user-model";
import config from "../config/config";

const {FRONTEND_BASE_URL} = config

export const getAllCollections = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.redirect(`${FRONTEND_BASE_URL}/sign-in`);
    }
    const collectionsAggregate = await Users.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$collections" },
      {
        $group: {
          _id: null,
          allCollections: { $push: "$collections.name" },
        },
      },
      {
        $project: {
          _id: 0,
          allCollections: 1,
        },
      },
    ]);

    const collections =
      collectionsAggregate.length > 0
        ? collectionsAggregate[0].allCollections
        : [];

    return res.status(200).json({
      status: "OK",
      data: {
        collections,
      },
    });
  }
);

export const getAllSavesInACollection = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const {collectionName} = req.params;
    if (!userId) {
      return res.redirect(`${FRONTEND_BASE_URL}/sign-in`);
    }

    const collectionSavesAggregate = await Users.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $addFields: {
          unarchivedSaves: {
            $filter: {
              input: "$saves",
              as: "save",
              cond: { "$$save.archived": false },
            },
          },
        },
      },
      {
        $addFields: {
          unarchivedSaveIds: {
            $push: "$unarchivedSaves.saveId",
          },
        },
      },
      { $unwind: "$collections" },
      {
        $match: {
          "collections.name": collectionName,
        },
      },
      {
        $addFields: {
          OGCollectionSaveIds: {
            $filter: {
              input: "$collections.saveIds",
              as: "saveId",
              cond: { $in: ["$$saveId", "$unarchivedSaveIds"] },
            },
          },
        },
      },
      // {$unwind: "$saves"},
      // {$match: {
      // 	"saves.archived": false
      // }},
      // {$group: {
      // 	_id: null,
      // 	unarchivedSaveIds: {$push: "$saves.saveId"}
      // }},
      // {$project: {
      // 	_id: 0,
      // 	unarchivedSaveIds: 1,
      // }},
      // { $unwind: "$collections" },
      // {
      //   $match: {
      //     "collections.name": collectionName,
      //   },
      // },
      // { $unwind: "$collections.saveIds" },
      // {$match: {
      // 	"collections.saveIds": {$in: "$unarchivedSaveIds"}
      // }},
      {
        $lookup: {
          from: "saves",
          let: { collectionSaveIds: "$OGCollectionSaveIds" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$foreignField", "$$colectionSaveIds"],
                },
              },
            },
            {
              $project: {
                url: 1,
                title: 1,
                image: 1,
                description: 1,
                siteName: 1,
              },
            },
          ],
          as: "collections.saves",
        },
      },
      { $unwind: "$collections.saves" },
      {
        $group: {
          _id: null,
          collectionSaves: { $push: "$collections.saves" },
        },
      },
      {
        $project: {
          _id: 0,
          collectionSaves: 1,
        },
      },
    ]);

    const collectionSaves =
      collectionSavesAggregate.length > 0
        ? collectionSavesAggregate[0].collectionSaves
        : [];

    return res.status(200).json({
      status: "OK",
      data: {
        saves: collectionSaves,
      },
    });
  }
);

export const createCollection = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.redirect(`${FRONTEND_BASE_URL}/sign-in`);
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
    return res.status(201).json({
      status: "OK",
    });
  }
);

export const addSavesToCollection = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const {collectionId} = req.params;
    const saveIds = req.body.saveIds;
    if (!userId) {
      return res.redirect(`${FRONTEND_BASE_URL}/sign-in`);
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

    return res.status(200).json({
      status: "OK",
    });
  }
);

export const editCollection = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const {collectionId} = req.params;
    const editQuery = req.body.updateQuery;
    const removedSaveIds = req.body?.saveIds;
    if (!userId) {
      return res.redirect(`${FRONTEND_BASE_URL}/sign-in`);
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

    return res.status(200).json({
      status: "OK",
    });
  }
);

export const deleteCollection = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const {collectionId} = req.params;
    if (!userId) {
      return res.redirect(`${FRONTEND_BASE_URL}/sign-in`);
    }

    const deletedCollection = await Users.updateOne(
      { _id: userId, "collections._id": collectionId },
      { $pull: { collections: { _id: collectionId } } }
    );
    if (!deletedCollection) {
      const error = new CustomError(
        500,
        "Failed to delete collection. Try again later."
      );
      return next(error);
    }

    return res.status(204).json({
      status: "OK",
    });
  }
);
