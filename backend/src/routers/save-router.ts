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

router.route("/save/:saveId").get(getSave);

router.route("/search").get(searchSaves);

router.route("/archives").get(getArchives);

router.route("/favourites").get(getFavourites);

router.route("/add-save").post(addSave);

router.route("/update-saves").post(updateSaves);

router.route("/delete-saves").post(deleteSaves);
