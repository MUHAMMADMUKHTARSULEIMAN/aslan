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

const Tags = new mongoose.Model("Tag", tagSchema)
export default Tags;