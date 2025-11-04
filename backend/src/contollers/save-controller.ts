import type { NextFunction, Request, Response } from "express";
import asyncErrorHandler from "../utils/async-error-handler";
import Saves from "../models/save-model";
import CustomError from "../utils/custom-error";
import Processor from "../utils/processor";
import Users from "../models/user-model";

export const getSaves = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const saves = await Saves.find({ archived: false });

    res.status(200).json({
      status: "OK",
      data: {
        saves,
      },
    });
  }
);

export const getArchives = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const archives = await Saves.find({ archived: true });

    res.status(200).json({
      status: "OK",
      data: {
        archives,
      },
    });
  }
);

export const getFavourites = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const favourites = await Saves.find({ favourite: true });

    res.status(200).json({
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
      res.redirect("/sign-in");
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
        const error = new CustomError(409, "Article already saved.");
        return next(error);
      }

      const userSave = await Users.updateOne(
        { id: userId },
        { $push: { saves: { saveId: existingSave._id } } }
      );

      if (!userSave) {
        const error = new CustomError(
          500,
          "Article could not be added. Try again later."
        );
        return next(error);
      }

      res.status(201).json({
        status: "OK",
      });
    }

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
        "Article could not be added. Try again later."
      );
      return next(error);
    }

    const userSave = await Users.updateOne(
      { id: userId },
      { $push: { saves: { saveId: save._id } } }
    );

    if (!userSave) {
      const error = new CustomError(
        500,
        "Article could not be added. Try again later."
      );
      return next(error);
    }

    res.status(201).json({
      status: "OK",
    });
  }
);

export const updateSaves = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const saveIds = req.body.saveIds;
    const updateQuery = req.body.updates;
    if (!userId) {
      res.redirect("/sign-in");
    }
    if (!saveIds) {
      const error = new CustomError(400, `No saveId was provided.`);
      return next(error);
    }

    const dynamicSet: Record<string, any> = {};

    for (const key in updateQuery) {
      if (Object.prototype.hasOwnProperty.call(updateQuery, key)) {
        const updatePath = `saves.$[el].${key}`;

        dynamicSet[updatePath] = updateQuery[key as keyof typeof updateQuery];
      }
    }

    const updates = await Users.updateOne(
      {
        _id: userId,
        saves: { $in: saveIds },
      },
      { $set: dynamicSet },
      { runValidators: true, arrayFilters: [{ "el.saveId": { $in: saveIds } }] }
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

		if(updates.matchedCount !== updates.modifiedCount) {
			const error = new CustomError(404, "Not all articles were updated.")
		}

    res.status(200).json({
      status: "OK",
    });
  }
);

export const deleteSaves = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const saveIds = req.body.saveIds;
    if (!userId) {
      res.redirect("/sign-in");
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
      const error = new CustomError(404, `Not all articles were deleted.`);
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

    res.status(204).json({
      status: "OK",
    });
  }
);

export const getHighlights = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // const highlight = await Saves;
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
    const id = req.body.highlightId;
    const highlight = req.body.highlight;
    const updatedHighlight = await Saves.updateOne(
      { url, "highlights._id": id },
      { $set: { "highlights.$.highlight": highlight } },
      { runValidators: true }
    );
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
