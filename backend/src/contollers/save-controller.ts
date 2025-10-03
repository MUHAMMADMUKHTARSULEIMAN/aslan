import type { NextFunction, Request, Response } from "express";
import asyncErrorHandler from "../utils/async-error-handler";
import Saves from "../models/save-model";
import CustomError from "../utils/custom-error";

export const addSave = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const url = req.body.url;
    if (!url) {
      const error = new CustomError(400, "A valid URL must be provided");
      return next(error);
    }

    const packet = {
      url,
      title: "new title",
      image: "htps:///",
      siteName: "new site",
      html: "",
      length: 0,
    };
    const save = Saves.create(packet);

    res.status(201).json({
      status: "OK",
    });
  }
);

// export const updateSave = asyncErrorHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const w = "";
//   }
// );
