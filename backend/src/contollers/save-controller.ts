import type { NextFunction, Request, Response } from "express";
import asyncErrorHandler from "../utils/async-error-handler";
import Saves from "../models/save-model";
import CustomError from "../utils/custom-error";
import Processor from "../utils/processor";
import Tags from "../models/tag-model";
import Collections from "../models/collection-model";

export const getSaves = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const saves = await Saves;
  }
);

export const addSave = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const url = req.body.url;
    if (!url) {
      const error = new CustomError(400, "A valid URL must be provided");
      return next(error);
    }
    const reqHTML = req.body?.html;
    const processor = new Processor();
    let html = null;
    if (!reqHTML) {
      html = await processor.fetchHTML(url);
    }
    const title =
      processor.findTitle(reqHTML || html || "") || processor.getHostname(url);
    const image = processor.findThumbnail(reqHTML || html || "", url);
    const siteName =
      processor.findSiteName(reqHTML || html || "") ||
      processor.getHostname(url);
    const length = processor.findLength(reqHTML || html || "");

    const packet = {
      url,
      title,
      image,
      siteName,
      html: reqHTML || html,
      length,
    };
    const save = await Saves.create(packet);
    if (!save) {
      const error = new CustomError(
        500,
        "Save could not be added. Try again later."
      );
      return next(error);
    }

    res.status(201).json({
      status: "OK",
    });
  }
);

export const updateSave = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const urls = req.body.urls;
    const updateQuery = req.body.updates;
    if (!urls) {
      const error = new CustomError(400, "URLs not provided.");
      return next(error);
    }

    const updates = await Saves.updateMany(
      { url: { $in: urls } },
      { $set: updateQuery },
      { runValidators: true }
    );
    if (!updates) {
      const error = new CustomError(
        500,
        `Articles could not be updated. Try again later.`
      );
      return next(error);
    }

    res.status(200).json({
      status: "OK",
    });
  }
);

export const deleteSave = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const urls = req.body.urls;
    if (!urls) {
      const error = new CustomError(400, "URLs not provided.");
      return next(error);
    }

    const deletes = await Saves.deleteMany({ url: { $in: urls } });
    if (!deletes) {
      const error = new CustomError(
        404,
        `No articles with the given urls were found.`
      );
      return next(error);
    }
    if (urls.length !== deletes.deletedCount) {
      const error = new CustomError(404, `Not all saves were deleted.`);
      return next(error);
    }

    const tagsUpdate = await Tags.updateMany(
      { urls: { $in: urls } },
      { $pull: { urls: { $each: urls } } },
      { runValidators: true }
    );
    if (!tagsUpdate) {
      const error = new CustomError(
        500,
        `Deleted ${
          urls.length === 1 ? "save" : "saves"
        } could not be removed from tags.`
      );
      return next(error);
    }

    const collectionsUpdate = await Collections.updateMany(
      { urls: { $in: urls } },
      { $pull: { urls: { $each: urls } } },
      { runValidators: true }
    );
    if (!collectionsUpdate) {
      const error = new CustomError(
        500,
        `Deleted ${
          urls.length === 1 ? "save" : "saves"
        } could not be removed from collections.`
      );
      return next(error);
    }

    res.status(204).json({
      status: "OK",
    });
  }
);

export const getHighlights = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const highlight = await Saves;
  }
);

export const addHighlight = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const url = req.body.url;
    const highlight = req.body.highlight;
    const addedHighlight = await Saves.updateOne(
      url,
      {
        $push: { highlights: { highlight } },
      },
      { runValidators: true }
    );
    if (!addedHighlight) {
      const error = new CustomError(500, `Unable to add highlight.`);
      return next(error);
    }

    res.status(200).json({
      status: "OK",
    });
  }
);

export const updateHighlight = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const url = req.body.url;
    const id = req.body.id;
    const highlight = req.body.highlight;
    const updatedHighlight = await Saves.updateOne({
      $and: [
        { url, "highlights._id": id },
        { $set: { "highlights.$.highlight": highlight } },
        { runValidators: true },
      ],
    });
    if (!updatedHighlight) {
      const error = new CustomError(500, `Unable to add highlight.`);
      return next(error);
    }

    res.status(200).json({
      status: "OK",
    });
  }
);
export const deleteHighlights = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const url = req.body.url;
    const ids = req.body?.ids;
    if (ids) {
      const deleteHighlights = await Saves.updateOne(
        { url },
        { $pull: { highlights: { _id: { $in: ids } } } }
      );
      if (!deleteHighlights) {
        const error = new CustomError(
          500,
          `${
            ids.length === 1 ? "Highlight" : "Highlights"
          } could not be deleted.`
        );
        return next(error);
      }

      res.status(204).json({
        status: "OK",
      });
    } else {
      const deleteHighlights = await Saves.updateOne(
        { url },
        { $set: { highlights: [] } }
      );
			if (!deleteHighlights) {
        const error = new CustomError(
          500,
          `${
            ids.length === 1 ? "Highlight" : "Highlights"
          } could not be deleted.`
        );
        return next(error);
      }

      res.status(204).json({
        status: "OK",
      });
    }
  }
);
