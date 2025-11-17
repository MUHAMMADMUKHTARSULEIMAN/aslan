import express from "express";
import {
  addTagstoSaves,
  editTag,
  editTagsOnSave,
  getAllSavesWithSpecificTag,
  getAllTags,
  deleteTags,
} from "../contollers/tag-controller";

export const router = express.Router();

router.route("/").get(getAllTags);

router.route("/:tagName").get(getAllSavesWithSpecificTag);

router.route("/add-tags").patch(addTagstoSaves);

router.route("/edit-tags/:saveId").patch(editTagsOnSave);

router.route("/edit-tag/:tagId").patch(editTag);

router.route("/delete-tags").patch(deleteTags);
