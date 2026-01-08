import type { NextFunction, Request, Response } from "express";
import axios from "axios";
import { format, subDays } from "date-fns";
import asyncErrorHandler from "../utils/async-error-handler";
import Processor from "../utils/processor";
import Feeds from "../models/feed-model";
import CustomError from "../utils/custom-error";
import Discoveries from "../models/discovery-model";
import Users from "../models/user-model";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import config from "../config/config";

const { JWT_SECRET } = config;

interface Discovery {
  url: string;
  title: string;
  image: string;
  excerpt: string;
  siteName: string;
  feedName: string;
  length: number;
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
    let BingIotD = null;
    let discoveriesContainer: Array<Discovery> = [];
    for (let i = 0; i < feeds.length; i++) {
			const name = feeds[i].name;
      const url = feeds[i].url;
      const categories = feeds[i].categories;
			console.log(i, name)
      const feed = await processor.fetchFeed(url);
      if (feed) {
        if (feed.items.length > 0) {
          for (let j = 0; j < feed.items.length; j++) {
						const item = feed.items[j];
            if (typeof item.link === "string") {
							console.log(j, item.link)
              const HTML = await processor.fetchHTML(item.link);
              if (HTML) {
                const title = processor.findTitle(HTML);
                if (!title) break;
                const excerpt = processor.findDescription(HTML, 200) || "";
                const length = processor.findLength(HTML) || 0;
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
                } else if (processor.findThumbnail(HTML, item.link) !== null) {
                  image = processor.findThumbnail(HTML, item.link);
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
                  processor.findSiteName(HTML) ||
                  processor.getHostname(item.link);
                const discovery: Discovery = {
                  url: item.link,
                  title,
                  image,
                  excerpt,
                  siteName,
                  feedName: name,
                  length,
                  categories: categories,
                };
                let checker = false;
                for (let k = 0; k < discoveriesContainer.length; k++) {
                  if (discovery.url === discoveriesContainer[k].url) {
                    checker = true;
                    break;
                  }
                }
                if (!checker) {
                  discoveriesContainer.push(discovery);
                }
              }
              if (j === 2) break;
            }
          }
        }
      }
    }

    if (discoveriesContainer.length === 0) {
      const error = new CustomError(404, "No new article was discoved.");
      return next(error);
    }

    const discoveries = await Discoveries.create(discoveriesContainer);
    if (!discoveries) {
      const error = new CustomError(
        500,
        "Articles could not be added. Please try again later."
      );
      return next(error);
    }

    const date = format(subDays(new Date(), 1), "yyyy-MM-dd");
    await Discoveries.deleteMany({ dateCreated: !date });

    return res.status(201).json({
      status: "OK",
    });
  }
);

export const getHomeFeed = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const JWT = req.signedCookies.jwt || res.locals.jwt
		
    let id;
    let user;
		
    if (JWT) {
			const decodedToken = jwt.verify(JWT, JWT_SECRET);
			// @ts-expect-error
			const id = decodedToken.id
      user = await Users.findById(id);
    }

    const name = user?.firstName || null;

    const categories = [
      "Business",
      "Health & Fitness",
      "Politics",
      "Science",
      "Self Improvement",
      "Technology",
      "Travel",
    ];

    const feedAggregate = await Discoveries.aggregate([
      {
        $match: {
					categories: {$in: categories}
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

    const article = feedAggregate.length > 0 ? feedAggregate[0] : [];

    res.status(200).json({
      status: "OK",
      data: {
        user: name,
        articles: article,
      },
    });
  }
);
