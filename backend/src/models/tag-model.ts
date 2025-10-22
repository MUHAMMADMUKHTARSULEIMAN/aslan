import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	urls: {
		type: [String],
	},
})

const Tags = mongoose.model("Tag", tagSchema)
export default Tags;