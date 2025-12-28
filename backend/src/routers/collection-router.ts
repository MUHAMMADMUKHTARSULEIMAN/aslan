import express from "express";
import {
  addSavesToCollection,
  createCollection,
  deleteCollection,
  editCollection,
  getAllCollections,
  getAllSavesInACollection,
} from "../controllers/collection-controller";

export const router = express.Router();

router.route("/").get(getAllCollections);

router.route("/:collectionName").get(getAllSavesInACollection);

router.route("/create-collection").post(createCollection);

router.route("/add-saves/:collectionId").patch(addSavesToCollection);

router.route("/edit-collection/:collectionId").patch(editCollection);

router.route("/delete-collection/:collectionId").delete(deleteCollection);
