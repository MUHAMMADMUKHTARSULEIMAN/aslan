import mongoose, { Schema } from "mongoose";

const highlightSchema = new mongoose.Schema({
  highlight: {
    type: String,
    required: true,
  },
});

const saveSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "URL not provided"],
    unique: [true, "Item already added"],
  },
  title: {
    type: String,
    required: [true, "Title not provided"],
  },
  image: {
    type: String,
  },
  siteName: {
    type: String,
    required: [true, "Name of site not provided"],
  },
  length: {
    type: Number,
  },
  dateCreated: {
    type: String,
    default: new Date().toISOString(),
  },
  html: {
    type: String,
  },
  highlights: [highlightSchema],
  favourite: {
    type: Boolean,
    default: false,
  },
  archived: {
    type: Boolean,
    default: false,
  },
});

const Saves = mongoose.model("Save", saveSchema);
export default Saves;
