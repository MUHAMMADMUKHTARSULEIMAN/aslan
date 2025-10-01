import mongoose from "mongoose";

const feedSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true,
		unique: true,
	},
	categories: {
		type: [String],
		required: true,
	},
})

const Feeds = mongoose.model("Feed", feedSchema)
export default Feeds;