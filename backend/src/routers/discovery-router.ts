import express from "express"
import { createFeeds, getSelectedFeeds } from "../controllers/discovery-controller";

export const router = express.Router()

router.route("/create-feeds").post(createFeeds)

router.route("/get-feed-articles").get(getSelectedFeeds)