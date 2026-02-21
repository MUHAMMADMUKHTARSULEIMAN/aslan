import express from "express"
import { createFeeds, getDiscoveries, getFeedNames, getHomeFeed, getRecents } from "../controllers/discovery-controller";

export const router = express.Router()

router.route("/create-feeds").post(createFeeds)

router.route("/get-home-feed/").get(getHomeFeed)

router.route("/get-recents/:email").get(getRecents)

router.route("/get-feed-names/:category").get(getFeedNames)

router.route("/get-discoveries/:category/:feed").get(getDiscoveries)