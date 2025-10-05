import mongoose from "mongoose";

const saveSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "URL not provided"],
		unique: [true, "Item already added"]
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
	highlights: {
		type: [String],
	},
	favourite: {
		type: Boolean,
		default: false
	},
	archived: {
		type: Boolean,
		default: false
	},
});

const Saves = mongoose.model("Save", saveSchema);
export default Saves;