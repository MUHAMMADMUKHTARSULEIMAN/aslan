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

const Collections = new mongoose.Model("Collection", collectionSchema)
export default Collections;