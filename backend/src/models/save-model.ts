import { Schema, model } from "mongoose";

const saveSchema = new Schema(
  {
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
    html: {
      type: String,
    },
  },
  { timestamps: true }
);

const Saves = model("Save", saveSchema);
export default Saves;
