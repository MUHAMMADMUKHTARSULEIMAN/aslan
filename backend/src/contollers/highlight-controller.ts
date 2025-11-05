import type { Request, Response, NextFunction } from "express";
import Users from "../models/user-model";
import asyncErrorHandler from "../utils/async-error-handler";
import CustomError from "../utils/custom-error";

export const getHighlights = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // const highlight = await Saves;
  }
);

export const addHighlight = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const saveId = req.body.saveId;
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
    const saveId = req.body.saveId;
    const highlightId = req.body.highlightId;
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
    const saveId = req.body.saveId;
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
