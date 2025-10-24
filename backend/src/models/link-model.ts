import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  data: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: "600s",
  },
});

const Links = mongoose.model("Link", linkSchema);
export default Links;
