import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String
	},
	urls: {
		type: [String],
	},
})

const Collections = mongoose.model("Collection", collectionSchema)
export default Collections;