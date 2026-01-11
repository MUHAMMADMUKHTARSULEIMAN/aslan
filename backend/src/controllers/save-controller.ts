import type { NextFunction, Request, Response } from "express";
import escapeStringRegexp from "escape-string-regexp";
import asyncErrorHandler from "../utils/async-error-handler";
import Saves from "../models/save-model";
import CustomError from "../utils/custom-error";
import Processor from "../utils/processor";
import Users from "../models/user-model";
import config from "../config/config";

const { FRONTEND_BASE_URL } = config;

export const getSaves = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.redirect(`${FRONTEND_BASE_URL}/sign-in`);
    }
    const savesAggregate = await Users.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      { $unwind: "$saves" },
      {
        $match: {
          "saves.archived": false,
        },
      },
      {
        $lookup: {
          from: "saves",
          localField: "saves.saveId",
          foreignField: "_id",
          as: "saves.save",
          pipeline: [
            {
              $project: {
                url: 1,
                title: 1,
                image: 1,
                siteName: 1,
                length: 1,
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          defaultSaves: { $push: "$saves.save" },
        },
      },
      {
        $project: {
          _id: 0,
          defaultSaves: 1,
        },
      },
    ]);

    const defaultSaves =
      savesAggregate.length > 0 ? savesAggregate[0].defaultSaves : [];

    return res.status(200).json({
      status: "OK",
      data: {
        saves: defaultSaves,
      },
    });
  }
);

export const getSave = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const { saveId } = req.params;
    if (!userId) {
      return res.redirect(`${FRONTEND_BASE_URL}/sign-in`);
    }

    const articleAggregate = await Users.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      { $unwind: "$saves" },
      {
        $match: {
          "saves.saveId": saveId,
        },
      },
      {
        $lookup: {
          from: "saves",
          localField: "saves.saveId",
          foreignField: "_id",
          as: "saves.save",
          pipeline: [
            {
              $project: {
                url: 1,
                title: 1,
                siteName: 1,
                html: 1,
              },
            },
          ],
        },
      },
      {
        $unset: [
          "saves.saveId",
          "saves.tags",
          "saves.archived",
          "saves.favourite",
        ],
      },
      {
        $project: {
          _id: 0,
          saves: 1,
        },
      },
    ]);

    const article =
      articleAggregate.length > 0 ? articleAggregate[0].saves : [];

    return res.status(200).json({
      status: "OK",
      data: {
        article,
      },
    });
  }
);

export const searchSaves = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const archived = req.body.archived;
    const searchString = req.query.q;
    let unescapedSearchString = "";
    if (typeof searchString === "string") {
      unescapedSearchString = escapeStringRegexp(searchString);
    }
    const searchRegex = `\\${unescapedSearchString}\\`;
    if (!userId) {
      return res.redirect(`${FRONTEND_BASE_URL}/sign-in`);
    }

    const searchAggregate = await Users.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      { $unwind: "$saves" },
      {
        $match: {
          "saves.archived": archived,
        },
      },
      {
        $lookup: {
          from: "saves",
          localField: "saves.saveId",
          foreignField: "_id",
          as: "saves.save",
          pipeline: [
            {
              $project: {
                url: 1,
                title: 1,
                image: 1,
                siteName: 1,
                length: 1,
              },
            },
          ],
        },
      },
      {
        $match: {
          $or: [
            {
              "saves.save.title": {
                $regex: searchRegex,
                $options: "i",
              },
            },
            {
              "saves.save.siteName": {
                $regex: searchRegex,
                $options: "i",
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          searchSaves: { $push: "$saves.save" },
        },
      },
      {
        $project: {
          _id: 0,
          searchSaves: 1,
        },
      },
    ]);

    const searchSaves =
      searchAggregate.length > 0 ? searchAggregate[0].searchSaves : [];

    return res.status(200).json({
      status: "OK",
      data: {
        saves: searchSaves,
      },
    });
  }
);

export const getArchives = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.redirect(`${FRONTEND_BASE_URL}/sign-in`);
    }
    const archivesAggregate = await Users.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      { $unwind: "$saves" },
      {
        $match: {
          "saves.archived": true,
        },
      },
      {
        $lookup: {
          from: "saves",
          localField: "saves.saveId",
          foreignField: "_id",
          as: "saves.save",
          pipeline: [
            {
              $project: {
                url: 1,
                title: 1,
                image: 1,
                siteName: 1,
                length: 1,
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          archives: { $push: "$saves.save" },
        },
      },
      {
        $project: {
          _id: 0,
          archives: 1,
        },
      },
    ]);

    const archives =
      archivesAggregate.length > 0 ? archivesAggregate[0].archives : [];

    return res.status(200).json({
      status: "OK",
      data: {
        archives,
      },
    });
  }
);

export const getFavourites = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.redirect(`${FRONTEND_BASE_URL}/sign-in`);
    }
    const favouritesAggregate = await Users.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      { $unwind: "$saves" },
      {
        $match: {
          "saves.favourite": true,
          "saves.archived": false,
        },
      },
      {
        $lookup: {
          from: "saves",
          localField: "saves.saveId",
          foreignField: "_id",
          as: "saves.save",
          pipeline: [
            {
              $project: {
                url: 1,
                title: 1,
                image: 1,
                siteName: 1,
                length: 1,
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          favourites: { $push: "$saves.save" },
        },
      },
      {
        $project: {
          _id: 0,
          favourites: 1,
        },
      },
    ]);

    const favourites =
      favouritesAggregate.length > 0 ? favouritesAggregate[0].favourites : [];

    return res.status(200).json({
      status: "OK",
      data: {
        favourites,
      },
    });
  }
);

export const addSave = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const url = req.body.url;
    const reqHTML = req.body?.html;

    if (!userId) {
      return res.redirect(`${FRONTEND_BASE_URL}/sign-in`);
    }
    if (typeof url !== "string") {
      const error = new CustomError(400, "A valid URL must be provided");
      return next(error);
    }

    const existingSave = await Saves.findOne({ url });
    if (existingSave) {
      const existingUserSave = await Users.exists({
        _id: userId,
        saves: {
          $elemMatch: {
            saveId: existingSave._id,
          },
        },
      });
      if (existingUserSave) {
        const error = new CustomError(409, "Article already added.");
        return next(error);
      }

      const userSave = await Users.updateOne(
        { _id: userId },
        { $push: { saves: { saveId: existingSave._id } } }
      );

      if (!userSave) {
        const error = new CustomError(
          500,
          "Article could not be added. Try again later."
        );
        return next(error);
      }

      return res.status(201).json({
        status: "OK",
        message: "Article added successfully.",
      });
    } else {
      const processor = new Processor();
      let html = null;
      if (!reqHTML) {
        html = await processor.fetchHTML(url);
      }
			const metadata = processor.findMetadata(reqHTML || html || "", url, 200)
      const title =
        metadata.title||
        processor.getHostname(url);
      const image = metadata.thumbnail;
      const siteName =
        metadata.siteName ||
        processor.getHostname(url);
      const length = metadata.length
      const description = metadata.description
      const publishedTime = metadata.publishedTime
      const author = metadata.author

      const packet = {
        url,
        title,
        image,
        description,
        siteName,
        html: reqHTML || html,
        length,
        publishedTime,
        author,
      };
      const save = await Saves.create(packet);
      if (!save) {
        const error = new CustomError(
          500,
          "Article could not be added. Try again later."
        );
        return next(error);
      }

      const userSave = await Users.updateOne(
        { _id: userId },
        { $push: { saves: { saveId: save._id } } }
      );

      if (!userSave) {
        const error = new CustomError(
          500,
          "Article could not be added. Try again later."
        );
        return next(error);
      }

      return res.status(201).json({
        status: "OK",
        message: "Article added successfully.",
      });
    }
  }
);

export const updateSaves = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const saveIds = req.body.saveIds;
    const updateQuery = req.body.updates;
    if (!userId) {
      return res.redirect(`${FRONTEND_BASE_URL}/sign-in`);
    }
    if (!saveIds) {
      const error = new CustomError(400, `No saveId was provided.`);
      return next(error);
    }

    const dynamicSet: Record<string, any> = {};

    for (const key in updateQuery) {
      if (Object.prototype.hasOwnProperty.call(updateQuery, key)) {
        const updatePath = `saves.$[save].${key}`;

        dynamicSet[updatePath] = updateQuery[key as keyof typeof updateQuery];
      }
    }

    const updates = await Users.updateOne(
      {
        _id: userId,
        "saves.saveId": { $in: saveIds },
      },
      { $set: dynamicSet },
      {
        runValidators: true,
        arrayFilters: [{ "save.saveId": { $in: saveIds } }],
      }
    );
    if (!updates) {
      const error = new CustomError(
        500,
        `${
          saveIds.length === 1 ? "Article" : "Articles"
        } could not be updated. Try again later.`
      );
      return next(error);
    }

    if (updates.matchedCount !== updates.modifiedCount) {
      const error = new CustomError(404, "Not all articles were updated.");
    }

    return res.status(200).json({
      status: "OK",
    });
  }
);

export const deleteSaves = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const saveIds = req.body.saveIds;
    if (!userId) {
      return res.redirect(`${FRONTEND_BASE_URL}/sign-in`);
    }
    if (!saveIds) {
      const error = new CustomError(400, `No id was provided.`);
      return next(error);
    }

    const deletes = await Users.updateOne(
      { _id: userId },
      { $pull: { saves: { saveId: { $in: saveIds } } } }
    );
    if (!deletes) {
      const error = new CustomError(
        404,
        `No ${saveIds.length === 1 ? "article" : "articles"} with the given ${
          saveIds.length === 1 ? "id" : "ids"
        } ${saveIds.length === 1 ? "was" : "were"} found.`
      );
      return next(error);
    }

    if (deletes.matchedCount !== deletes.modifiedCount) {
      const error = new CustomError(500, `Not all articles were deleted.`);
      return next(error);
    }

    const collectionsUpdate = await Users.updateOne(
      { _id: userId, "collections.saveIds": { $in: saveIds } },
      { $pull: { "collections.$[].saveIds": { $in: saveIds } } },
      { runValidators: true }
    );
    if (!collectionsUpdate) {
      const error = new CustomError(
        500,
        `Deleted ${
          saveIds.length === 1 ? "article" : "articles"
        } could not be removed from collections.`
      );
      return next(error);
    }

    if (collectionsUpdate.matchedCount !== collectionsUpdate.modifiedCount) {
      const error = new CustomError(
        404,
        `Not all articles were removed from collections.`
      );
      return next(error);
    }

    return res.status(204).json({
      status: "OK",
    });
  }
);
