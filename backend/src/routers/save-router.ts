import express from "express";
import {
  addSave,
  deleteSaves,
  getArchives,
  getFavourites,
  getSave,
  getSaves,
  searchSaves,
  updateSaves,
} from "../controllers/save-controller";

export const router = express.Router();

router.route("/").get(getSaves);

router.route("/:saveId").get(getSave);

router.route("/search").get(searchSaves);

router.route("/archived").get(getArchives);

router.route("/favourites").post(getFavourites);

router.route("/add-save").post(addSave);

router.route("/update-saves").post(updateSaves);

router.route("/delete-saves").post(deleteSaves);
