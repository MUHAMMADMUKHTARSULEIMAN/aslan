import mongoose from "mongoose";
import config from "../config/config";

const {LINKING_ID_EXPIRY} = config

const linkSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: LINKING_ID_EXPIRY,
  },
});

const Links = mongoose.model("Link", linkSchema);
export default Links;
