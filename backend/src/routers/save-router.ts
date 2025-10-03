import express from "express"
import { addSave } from "../contollers/save-controller"

export const router = express.Router()

router.route("/add-save").post(addSave)