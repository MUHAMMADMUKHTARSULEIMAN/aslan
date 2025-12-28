import express from "express"
import { addFeedURL } from "../controllers/feed-controller";

export const router = express.Router()

router.route("/add-feed-url").post(addFeedURL)