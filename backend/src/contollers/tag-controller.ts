import type { NextFunction, Request, Response } from "express";
import asyncErrorHandler from "../utils/async-error-handler";
import Tags from "../models/tag-model";
import CustomError from "../utils/custom-error";

export const addTags = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const newTagsArray = [];
    const newTagsList = req.body?.newTags;
    const tagsList = req.body?.tags;
    const urls = req.body.urls;

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

    tagsList.push(newTagsList);
    const tags = await Tags.updateMany(
      { name: { $in: tagsList } },
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

export const updateTag = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.id;
    const name = req.body?.newName;
    const url = req.body?.url;

    const updatedTag = await Tags.updateOne({ _id: id });
  }
);

export const deleteTag = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);
