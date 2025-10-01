import mongoose from "mongoose";

const discoverySchema = new mongoose.Schema({
	link: {
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
    required: [false, "Excerpt not provided"],
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
    required: [true, "Length of article not provided"],
  },
  // publishedTime: {
  //   type: String,
  //   required: [false, "Time of publishing not provided"],
  // },
  categories: {
    type: [String],
    required: [true, "Categories not provided"]
  },
});

const Discoveries = mongoose.model("Discovery", discoverySchema)
export default Discoveries;
