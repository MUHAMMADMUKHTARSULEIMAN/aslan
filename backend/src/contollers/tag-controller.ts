import type { NextFunction, Request, Response } from "express";
import asyncErrorHandler from "../utils/async-error-handler";
import CustomError from "../utils/custom-error";
import Users from "../models/user-model";

export const getAllTags = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      res.redirect("/sign-in");
    }
    const tagsAggregate = await Users.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$saves" },
      { $unwind: "$saves.tags" },
      {
        $group: {
          _id: null,
          allTags: { $addToSet: "$saves.tags.name" },
        },
      },
      {
        $project: {
          _id: 0,
          allTags: 1,
        },
      },
    ]);

    const tags = tagsAggregate.length > 0 ? tagsAggregate[0].allTags : [];

    res.status(200).json({
      status: "OK",
      data: {
        tags,
      },
    });
  }
);

export const getAllSavesWithSpecificTAg = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const tagName = req.params.tagName;
    if (!userId) {
      res.redirect("/sign-in");
    }

    const tagSavesAggregate = await Users.aggregate([
      {
        $match: {
          _id: userId,
					"saves.archived": false
        },
      },
      { $unwind: "$saves" },
      { $match: { "saves.tags.name": tagName } },
      {
        $lookup: {
          from: "saves",
          localField: "saves.saveId",
          foreignField: "_id",
          as: "saves.save",
        },
      },
      { $unwind: "$saves.save" },
      {
        $group: {
          _id: null,
          tagSaves: { $push: "$saves.save" },
        },
      },
      {
        $project: {
          _id: 0,
          tagSaves: 1,
        },
      },
    ]);

    const tagSaves =
      tagSavesAggregate.length > 0 ? tagSavesAggregate[0].tagSaves : [];

    res.status(200).json({
      status: "OK",
      data: {
        saves: tagSaves,
      },
    });
  }
);

export const addTagstoSaves = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const saveIds = req.body.saveIds;
    const tagNamesList = req.body?.tags;
    const newTagNamesList = req.body?.newTags;
    const tagsList = [];
    if (!userId) {
      res.redirect("/sign-in");
    }

    if (newTagNamesList) {
      for (let i = 0; i < newTagNamesList.length; i++) {
        const tag = {
          name: newTagNamesList[i],
        };
        tagsList.push(tag);
      }
    }

    if (tagNamesList) {
      for (let i = 0; i < tagNamesList.length; i++) {
        const tag = {
          name: tagNamesList[i],
        };
        tagsList.push(tag);
      }
    }

    const tags = await Users.updateOne(
      { _id: userId, "saves.saveId": { $in: saveIds } },
      { $push: { "saves.$[].tags": { $each: tagsList } } },
      { runValidators: true }
    );
    if (!tags) {
      const error = new CustomError(
        500,
        `Failed to add ${tagsList.length === 1 ? "tag" : "tags"} to ${
          saveIds.length === 1 ? "article" : "articles"
        }. Try again later.`
      );
      return next(error);
    }

    res.status(200).json({
      status: "OK",
    });
  }
);

export const editTagsOnSave = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const saveId = req.body.saveId;
    const tagNamesList = req.body?.tags;
    const newTagNamesList = req.body?.newTags;
    const removedTagNamesList = req.body?.removedTags;
    const tagsList = [];
    if (!userId) {
      res.redirect("/sign-in");
    }

    if (removedTagNamesList) {
      const removedTags = await Users.updateOne(
        { _id: userId, "saves.saveId": saveId },
        { $pull: { "saves.$.tags": { name: { $in: removedTagNamesList } } } }
      );
      if (!removedTags) {
        const error = new CustomError(
          500,
          "Unable to remove tags from article. Try again later"
        );
        return next(error);
      }
    }

    if (newTagNamesList) {
      for (let i = 0; i < newTagNamesList.length; i++) {
        const tag = {
          name: newTagNamesList[i],
        };
        tagsList.push(tag);
      }
    }

    if (tagNamesList) {
      for (let i = 0; i < tagNamesList.length; i++) {
        const tag = {
          name: tagNamesList[i],
        };
        tagsList.push(tag);
      }
    }

    const tags = await Users.updateOne(
      { _id: userId, "saves.saveId": saveId },
      { $push: { "saves.$.tags": { $each: tagsList } } },
      { runValidators: true }
    );
    if (!tags) {
      const error = new CustomError(
        500,
        `Failed to add tags to article. Try again later.`
      );
      return next(error);
    }

    res.status(200).json({
      status: "OK",
    });
  }
);

export const editTag = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const tagId = req.body.tagId;
    const newTagName = req.body.newTagName;
    const removedTagNamesList = req.body.tags;
    if (!userId) {
      res.redirect("/sign-in");
    }

    if (tagId && newTagName) {
      const renamedTag = await Users.updateOne(
        { _id: userId, "saves.tags._id": tagId },
        { $set: { "saves.$[save].tags.$[tag].name": newTagName } },
        {
          runValidators: true,
          arrayFilters: [{ "save.tags._id": tagId }, { "tag._id": tagId }],
        }
      );
      if (!renamedTag) {
        const error = new CustomError(
          500,
          "Failed to rename tag. Try again later."
        );
        return next(error);
      }

      res.status(200).json({
        status: "OK",
      });
    }

    if (removedTagNamesList) {
      const deletedTags = await Users.updateOne(
        { _id: userId, "saves.tags.name": { $in: removedTagNamesList } },
        { $pull: { "saves.$[].tags": { name: { $in: removedTagNamesList } } } },
        { runValidators: true }
      );
      if (!deletedTags) {
        const error = new CustomError(
          500,
          `Unable to remove ${
            removedTagNamesList.length === 1 ? "tag" : "tags"
          }. Try again later`
        );
        return next(error);
      }

      res.status(204).json({
        status: "OK",
      });
    }
  }
);
