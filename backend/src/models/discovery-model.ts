import mongoose from "mongoose";
import { format } from "date-fns";

const discoverySchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "Link not provided"],
  },
  title: {
    type: String,
    required: [true, "Title not provided"],
  },
  image: {
    type: String,
    required: [true, "Image not provided"],
  },
  excerpt: {
    type: String,
  },
  siteName: {
    type: String,
    required: [true, "Name of site not provided"],
  },
  feedName: {
    type: String,
    required: [true, "Name of feed not provided"],
  },
  length: {
    type: Number,
  },
  categories: {
    type: [String],
    required: [true, "Categories not provided"],
  },
  dateCreated: {
    type: String,
    default: format(new Date(), "yyyy-MM-dd")
  },
});

const Discoveries = mongoose.model("Discovery", discoverySchema);
export default Discoveries;
