import Parser from "rss-parser";

const businessStories = async (url: string) => {
	const parser = new Parser({
		customFields: {
			item: [
				["enclosure", "enclosure"],
				["itunes:image", "itunesImage"],
				["media:content", "mediaContent"],
				["media:thumbnail", "mediaThumbnail"],
			]
		}
	})
	try {
		const feed = parser.parseURL(url)
		return feed
	} catch (error) {
		console.log(error)
	}
};
export default businessStories;
