import express from "express";
import {
  addTagstoSaves,
  editTag,
  editTagsOnSave,
  getAllSavesWithSpecificTag,
  getAllTags,
  deleteTags,
} from "../controllers/tag-controller";

export const router = express.Router();

router.route("/").get(getAllTags);

router.route("/tag/:tagName").get(getAllSavesWithSpecificTag);

router.route("/add-tags").patch(addTagstoSaves);

router.route("/edit-tags/:saveId").patch(editTagsOnSave);

router.route("/edit-tag/:tagId").patch(editTag);

router.route("/delete-tags").patch(deleteTags);
