import express from "express"
import { createFeeds } from "../contollers/discovery-controller";

export const router = express.Router()

router.route("/create-feeds").post(createFeeds)