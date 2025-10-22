import type { LinkingData } from "../auth/passport-setup"
import Links from "../models/link-model"

export const getAndDeleteLink = async (linkingId: string): Promise<LinkingData | null> => {
	const link = await Links.findByIdAndDelete(linkingId).lean()
	return link ? link.data as LinkingData : null 
}

export const createLink = async (data: LinkingData): Promise<string> => {
	const link = await Links.create({data})
	if(!link) {
		console.error(`Unable to create linking data`)
	}
	return link._id.toString()
}