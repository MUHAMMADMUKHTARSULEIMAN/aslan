import type { Request, Response, NextFunction } from "express";
import Users from "../models/user-model";
import asyncErrorHandler from "../utils/async-error-handler";
import CustomError from "../utils/custom-error";

export const getAllHighlights = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      res.redirect("/sign-in");
    }

    const savesHighlightsAggregate = await Users.aggregate([
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
              },
            },
          ],
        },
      },
			{ $unwind: "$saves.highlights" },
      {
        $unset: [
          "saves.saveId",
          "saves.tags",
          "saves.favourite",
          "saves.archived",
        ],
      },
      {
        $group: {
          _id: null,
          savesHighlights: { $push: "$saves" },
        },
      },
      {
        $project: {
          _id: 0,
          savesHighlights: 1,
        },
      },
    ]);

    const savesHighlights =
      savesHighlightsAggregate.length > 0
        ? savesHighlightsAggregate[0].savesHighlights
        : [];

    res.status(200).json({
      status: "OK",
      data: {
        saves: savesHighlights,
      },
    });
  }
);

export const getSaveHighlights = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const {saveId} = req.params;
    if (!userId) {
      res.redirect("/sign-in");
    }

    const highlightsAggregate = await Users.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      { $unwind: "$saves" },
      {
        $match: {
          "saves._id": saveId,
        },
      },
      { $unwind: "$saves.highlights" },
      {
        $group: {
          _id: null,
          highlights: { $push: "$saves.highlights" },
        },
      },
      {
        $project: {
          _id: 0,
          highlights: 1,
        },
      },
    ]);

    const highlights =
      highlightsAggregate.length > 0 ? highlightsAggregate[0].highlights : [];

    res.status(200).json({
      status: "OK",
      data: {
        highlights,
      },
    });
  }
);

export const addHighlight = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const {saveId} = req.params;
    const highlight = req.body.highlight;
    if (!userId) {
      res.redirect("/sign-in");
    }

    const addedHighlight = await Users.updateOne(
      { _id: userId, "saves.saveId": saveId },
      {
        $push: { "saves.$.highlights": { highlight } },
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
    const userId = req.user?._id;
    const {saveId, highlightId} = req.params;
    const highlight = req.body.highlight;
    if (!userId) {
      res.redirect("/sign-in");
    }

    const updatedHighlight = await Users.updateOne(
      { _id: userId, "saves.highlights._id": highlightId },
      { $set: { "saves.$[save].highlights.$[highlight].text": highlight } },
      {
        runValidators: true,
        arrayFilters: [
          { "save.saveId": saveId },
          { "highlight._id": highlightId },
        ],
      }
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
    const userId = req.user?._id;
    const {saveId} = req.params;
    const highlightIds = req.body?.highlightIds;
    if (!userId) {
      res.redirect("/sign-in");
    }

    if (highlightIds) {
      const deleteHighlights = await Users.updateOne(
        { _id: userId, "saves.saveId": saveId },
        { $pull: { "saves.$.highlights": { _id: { $in: highlightIds } } } }
      );
      if (!deleteHighlights) {
        const error = new CustomError(
          500,
          `${
            highlightIds.length === 1 ? "Highlight" : "Highlights"
          } could not be deleted.`
        );
        return next(error);
      }

      res.status(204).json({
        status: "OK",
      });
    } else {
      const deleteHighlights = await Users.updateOne(
        { _id: userId, "saves.saveId": saveId },
        { $set: { "saves.$.highlights": [] } }
      );
      if (!deleteHighlights) {
        const error = new CustomError(500, `Highlights could not be deleted.`);
        return next(error);
      }

      res.status(204).json({
        status: "OK",
      });
    }
  }
);
