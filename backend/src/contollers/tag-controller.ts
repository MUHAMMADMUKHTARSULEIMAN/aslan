import type { NextFunction, Request, Response } from "express";
import asyncErrorHandler from "../utils/async-error-handler";
import Tags from "../models/tag-model";
import CustomError from "../utils/custom-error";

export const addTags = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const urls = req.body.urls;
    const tagsList = req.body?.tags;
    const newTagsList = req.body?.newTags;
    const tagsArray = [];
    const newTagsArray = [];

    if (newTagsList) {
      for (let i = 0; i < newTagsList.length; i++) {
        const tag = {
          name: newTagsList[i],
        };
        newTagsArray.push(tag);
      }

      const newTags = await Tags.create(newTagsArray);
      if (!newTags) {
        const error = new CustomError(
          500,
          `Failed to create ${
            newTagsArray.length === 1 ? "a new tag" : "new tags"
          }. Try again later.`
        );
        return next(error);
      }

      tagsArray.push(newTagsList);
    }

    if (tagsList) {
      tagsArray.push(tagsList);
    }

    const tags = await Tags.updateMany(
      { name: { $in: tagsArray } },
      { $push: { urls: { $each: urls } } },
      { runValidators: true }
    );
    if (!tags) {
      const error = new CustomError(
        500,
        `Failed to add ${
          urls.length === 1 ? "article" : "articles"
        } to tags. Try again later.`
      );
      return next(error);
    }

    res.status(201).json({
      status: "OK",
    });
  }
);

export const editTags = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const url = req.body.url;
    const tagsList = req.body?.tags;
    const newTagsList = req.body?.newTags;
    const removedTagsList = req.body?.removedTags;
    const tagsArray = [];
    const newTagsArray = [];

    if (removedTagsList) {
      const removedTags = await Tags.updateMany(
        { name: { $in: removedTagsList } },
        { $pull: { urls: url } }
      );
      if (!removedTags) {
        const error = new CustomError(
          500,
          "Unable to remove tags. Try again later"
        );
        return next(error);
      }
    }

    if (newTagsList) {
      for (let i = 0; i < newTagsList.length; i++) {
        const tag = {
          name: newTagsList[i],
        };
        newTagsArray.push(tag);
      }

      const newTags = await Tags.create(newTagsArray);
      if (!newTags) {
        const error = new CustomError(
          500,
          `Failed to create ${
            newTagsArray.length === 1 ? "a new tag" : "new tags"
          }. Try again later.`
        );
        return next(error);
      }
      tagsArray.push(newTagsList);
    }

    if (tagsList) {
      tagsArray.push(tagsList);
    }

    const tags = await Tags.updateMany(
      { name: { $in: tagsArray } },
      { $push: { urls: url } },
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

export const deleteTags = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const tagsList = req.body.tags;

    const deletedTags = Tags.updateMany({ name: { $in: tagsList } });
    if (!deletedTags) {
      const error = new CustomError(
        500,
        "Unable to remove tags. Try again later"
      );
      return next(error);
    }

		res.status(204).json({
			status: "OK"
		})
  }
);
