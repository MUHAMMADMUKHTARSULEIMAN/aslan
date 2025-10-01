import type { NextFunction, Request, Response } from "express";
import asyncErrorHandler from "../utils/async-error-handler";
import Processor from "../utils/processor";
import Feeds from "../models/feed-model";
import CustomError from "../utils/custom-error";
import Discoveries from "../models/discovery-model";
import axios from "axios";

interface Discovery {
	link: string;
	title: string;
	image: string;
	excerpt: string;
	siteName: string;
	feedName: string;
	length: number;
	// publishedTime: string;
	categories: string[];
}

export const createFeeds = asyncErrorHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const processor = new Processor();
		const feeds = await Feeds.find();
		if (feeds.length === 0) {
			const error = new CustomError(404, "No feed was found");
			return next(error);
		}
		for (let i = 0; i < feeds.length; i++) {
			const url = feeds[i].url;
			const name = feeds[i].name;
			const categories = feeds[i].categories;
			if (!url || !name || !categories) {
				const error = new CustomError(400, "Malformed feed collection");
				return next(error);
			}
		}
		let BingIotD;
		let discoveriesContainer: Array<Discovery> = [];
		for (let i = 0; i < feeds.length; i++) {
			const name = feeds[i].name;
			const url = feeds[i].url;
			const categories = feeds[i].categories;
			console.log(i)
			console.log(url)
			const feed = await processor.fetchFeed(url);
			if (feed) {
				if (feed.items.length > 0) {
					for (let j = 0; j < 1; j++) {
						const item = feed.items[j];
						if (typeof item.link === "string") {
							console.log(item.link)
							const HTML = await processor.fetchHTML(item.link);
							if (HTML) {
								const article = processor.extractContent(HTML);
								if (article) {
									let image = "";
									if (item.mediaContent) {
										image = item.mediaContent.$.url;
									} else if (item.mediaThumbnail) {
										image = item.mediaThumbnail.$.url;
									} else if (
										item.enclosure &&
										item.enclosure.type === "image/jpeg"
									) {
										image = item.enclosure.url;
									} else if (item.itunesImage) {
										image = item.itunesImage.$.href;
									} else if (processor.findThumbnail(HTML) !== "") {
										image = processor.findThumbnail(HTML);
									} else if (processor.findFirstImage(article.content) !== "") {
										image = processor.findFirstImage(article.content);
									} else {
										if (!BingIotD) {
											const fetchBingIotD = await axios("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US")
											const imageURLEnd = fetchBingIotD.data.images[0].url
											BingIotD = `https://www.bing.com${imageURLEnd}`
										}
										image = BingIotD;
									}

									if (!image.startsWith("https://")) {
										const parsedLink = new URL(item.link)
										image = `${parsedLink.origin}${image}`
									}
									const siteName = processor.findSiteName(HTML, item.link)
									const discovery: Discovery = {
										link: item.link,
										title: article.title,
										image,
										excerpt: article.excerpt,
										siteName,
										feedName: name,
										length: article.length,
										// publishedTime: item.isoDate || article.publishedTime,
										categories: categories,
									};
									let checker = false;
									for (let k = 0; k < discoveriesContainer.length; k++) {
										if (discovery.link === discoveriesContainer[k].link) {
											checker = true;
											break;
										}
									}
									if (!checker) {
										discoveriesContainer.push(discovery);
									}
								}
							}
						}
					}
				}
			}
		}

		if (discoveriesContainer.length === 0) {
			const error = new CustomError(404, "No new article was discoved.");
			return next(error);
		}

		await Discoveries.deleteMany();

		const discoveries = await Discoveries.create(discoveriesContainer);

		res.status(201).json({
			status: "OK",
		});
	}
);
