import express from "express";
import {
  deleteHighlights,
  getAllHighlights,
  getSaveHighlights,
  updateHighlight,
} from "../controllers/highlight-controller";

export const router = express.Router();

router.route("/").get(getAllHighlights);

router.route("/:saveId").get(getSaveHighlights);

router.route("/add-highlight/:saveId").patch(getAllHighlights);

router.route("/update-highlight/:saveId/:highlightId").patch(updateHighlight);

router.route("/delete-highlights/:saveId").patch(deleteHighlights);
