import express from "express"
import { createFeeds, getHomeFeed } from "../controllers/discovery-controller";

export const router = express.Router()

router.route("/create-feeds").post(createFeeds)

router.route("/get-home-feed").get(getHomeFeed)