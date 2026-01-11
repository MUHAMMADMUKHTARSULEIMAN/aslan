import type { Types } from "mongoose"
import type { LinkingData } from "../auth/passport-setup"
import Links from "../models/link-model"

export const getAndDeleteLink = async (linkingId: Types.ObjectId): Promise<string | null> => {
	const link = await Links.findByIdAndDelete(linkingId).lean()
	return link ? link.googleId : null 
}

export const createLink = async (googleId: string): Promise<Types.ObjectId> => {
	const link = await Links.insertOne({googleId})
	if(!link) {
		console.error(`Unable to create linking data`)
	}
	return link._id
}