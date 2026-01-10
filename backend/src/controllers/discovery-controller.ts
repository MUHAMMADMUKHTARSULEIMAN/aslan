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
import config from "../config/config";

const { JWT_SECRET } = config;

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
    let discoveriesContainer: Array<Discovery> = [];
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
            if (j === 10) break;
          }
        }
      }
    }

    await Discoveries.deleteMany({ dateCreated: !date });

    return res.status(201).json({
      status: "OK",
    });
  }
);

export const getHomeFeed = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const JWT = req.signedCookies.jwt || res.locals.jwt;

    const decodedToken = jwt.verify(JWT || "", JWT_SECRET);
    // @ts-expect-error
    const id = decodedToken.id;
    const user = await Users.findById(id);

    const name = user?.firstName || null;

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
          _id: user?._id,
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
        user: name,
        articles,
        recents,
      },
    });
  }
);
