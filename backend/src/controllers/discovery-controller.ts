import type { NextFunction, Request, Response } from "express";
import axios from "axios";
import { format, subDays } from "date-fns";
import asyncErrorHandler from "../utils/async-error-handler";
import Processor from "../utils/processor";
import Feeds from "../models/feed-model";
import CustomError from "../utils/custom-error";
import Discoveries from "../models/discovery-model";
import Users from "../models/user-model";
import config from "../config/config";
import textSpacifier from "../utils/text-spacifier";

interface Discovery {
  url: string;
  title: string;
  image: string;
  excerpt: string | null;
  siteName: string;
  feedName: string;
  length: number | null;
  categories: string[];
  publishedTime: string | null;
  author: string | null;
}

export const createFeeds = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const processor = new Processor();
    const feeds = await Feeds.find();
    if (feeds.length === 0) {
      const error = new CustomError(404, "No feed was found");
      return next(error);
    }
    let BingIotD = null;
    const date = format(subDays(new Date(), 1), "yyyy-MM-dd");
    let k = 0;
    for (let i = 0; i < feeds.length; i++) {
      const name = feeds[i].name;
      const url = feeds[i].url;
      const categories = feeds[i].categories;
      console.log(i, name);
      const feed = await processor.fetchFeed(url);
      if (feed) {
        if (feed.items.length > 0) {
          for (let j = 0; j < feed.items.length; j++) {
            const item = feed.items[j];
            if (typeof item.link === "string") {
              k++;
              console.log(k, item.link);
              if (
                item.link ===
                "https://www.theverge.com/tech/858910/linux-diary-gaming-desktop"
              )
                continue;

              const existingDiscovery = await Discoveries.findOne({
                url: item.link,
                dateCreated: date,
              });
              if (existingDiscovery) continue;

              const HTML = await processor.fetchHTML(item.link);
              if (HTML) {
                const metadata = processor.findMetadata(HTML, item.link, 200);

                const title = item.title || metadata.title;
                if (!title) continue;

                const excerpt = metadata.description || item.summary || null;

                const length = metadata.length;

                let image = null;
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
                } else if (metadata.thumbnail !== null) {
                  image = metadata.thumbnail;
                } else {
                  if (!BingIotD) {
                    const fetchBingIotD = await axios(
                      "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US"
                    );
                    const imageURLEnd = fetchBingIotD.data.images[0].url;
                    BingIotD = `https://www.bing.com${imageURLEnd}`;
                  }
                  image = BingIotD;
                }

                const siteName =
                  metadata.siteName || processor.getHostname(item.link);

                const publishedTime =
                  metadata.publishedTime ||
                  item.pubDate ||
                  item.isoDate ||
                  null;

                const author = metadata.author || item.creator || null;

                const discovery: Discovery = {
                  url: item.link,
                  title,
                  image,
                  excerpt,
                  siteName,
                  feedName: name,
                  length,
                  categories,
                  publishedTime,
                  author,
                };

                await Discoveries.insertOne(discovery);
              }
            }
          }
        }
      }
    }

    const deletedDiscoveries = await Discoveries.deleteMany({
      dateCreated: { $lt: date },
    });
    if (!deletedDiscoveries) {
      const error = new CustomError(
        500,
        `Unable to delete old discoveries. Try again later.`
      );
      return next(error);
    }

    return res.status(201).json({
      status: "OK",
    });
  }
);

export const getHomeFeed = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
		const {email} = req.params

    const categories = [
      "Business",
      "Technology",
      "Health & Fitness",
      "Science",
      "Self Improvement",
      "Politics",
      "Travel",
    ];

    const feedAggregate = await Discoveries.aggregate([
      {
        $match: {
          categories: { $in: categories },
        },
      },
      { $unwind: "$categories" },
      {
        $match: {
          categories: { $in: categories },
        },
      },
      {
        $group: {
          _id: "$categories",
          articles: {
            $push: {
              _id: "$_id",
              url: "$url",
              title: "$title",
              image: "$image",
              excerpt: "$excerpt",
              siteName: "$siteName",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          data: { $slice: ["$articles", 3] },
        },
      },
    ]);

    const articles = feedAggregate.length > 0 ? feedAggregate : null;

    const recentsAggregate = await Users.aggregate([
      {
        $match: {
          email
        },
      },
      { $unwind: "$saves" },
      {
        $match: {
          "saves.archived": false,
        },
      },
      { $sort: { "saves.createdAt": -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "saves",
          localField: "saves.saveId",
          foreignField: "_id",
          as: "saves.save",
          pipeline: [
            {
              $project: {
                url: 1,
                title: 1,
                image: 1,
                siteName: 1,
                length: 1,
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          recents: { $push: "$saves.save" },
        },
      },
      {
        $project: {
          _id: 0,
          recents: 1,
        },
      },
    ]);

    const recents =
      recentsAggregate.length > 0 ? recentsAggregate[0].recents : null;

    res.status(200).json({
      status: "OK",
      data: {
        articles,
        recents,
      },
    });
  }
);

export const getFeedNames = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const params = req.params;
		const category = textSpacifier(params.category)
		console.log(category)

    const feedNamesAggregate = await Discoveries.aggregate([
      {
        $match: {
          categories: category,
        },
      },
      {
        $group: {
          _id: null,
          feedNames: { $addToSet: "$feedName" },
        },
      },
      {
        $project: {
          _id: 0,
          feedNames: 1,
        },
      },
    ], {collation:{locale: "en", strength: 1}});

    const feedNames =
      feedNamesAggregate.length > 0 ? feedNamesAggregate[0]?.feedNames : null;

    res.status(200).json({
      status: "OK",
      data: {
        feedNames,
      },
    });
  }
);

export const getDiscoveries = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const params = req.params;
		const category = textSpacifier(params.category)
		const feed = textSpacifier(params.feed)

    const discoveriesAggregate = await Discoveries.aggregate([
      {
        $match: {
					categories: category,
          feedName: feed,
        },
      },
      {
        $group: {
          _id: null,
          discoveries: {
            $push: {
              _id: "$_id",
              url: "$url",
              title: "$title",
              image: "$image",
              excerpt: "$excerpt",
              siteName: "$feedName",
            },
          },
        },
      },
			{
				$project: {
					_id: 0,
					discoveries: 1
				}
			}
    ], {collation:{locale: "en", strength: 1}});

		const discoveries = discoveriesAggregate.length > 0 ? discoveriesAggregate[0].discoveries : null

		res.status(200).json({
			status: "OK",
			data: {
				discoveries
			}
		})
  }
);
