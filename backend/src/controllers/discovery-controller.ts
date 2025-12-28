import type { NextFunction, Request, Response } from "express";
import axios from "axios";
import { format, subDays } from "date-fns";
import asyncErrorHandler from "../utils/async-error-handler";
import Processor from "../utils/processor";
import Feeds from "../models/feed-model";
import CustomError from "../utils/custom-error";
import Discoveries from "../models/discovery-model";

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
      const feed = await processor.fetchFeed(url);
      if (feed) {
        if (feed.items.length > 0) {
          for (let j = 0; j < feed.items.length; j++) {
            const item = feed.items[j];
            if (typeof item.link === "string") {
              const HTML = await processor.fetchHTML(item.link);
              if (HTML) {
                const article = processor.extractContent(HTML);
                if (article) {
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
                  const siteName = processor.findSiteName(HTML) || processor.getHostname(item.link);
                  const discovery: Discovery = {
                    url: item.link,
                    title: article.title,
                    image,
                    excerpt: article.excerpt,
                    siteName,
                    feedName: name,
                    length: article.length,
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
              }
            }
            if (j === 1) {
              break;
            }
          }
        }
      }
      if (i === 1) {
        break;
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

    res.status(201).json({
      status: "OK",
    });
  }
);
