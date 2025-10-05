import { Readability, isProbablyReaderable } from "@mozilla/readability";
import axios from "axios";
import { JSDOM } from "jsdom";
import * as cheerio from "cheerio";
import CustomError from "../utils/custom-error";
import Parser from "rss-parser";
import logger from "../utils/logger";

export interface Article {
  title: string;
  content: string;
  textContent: string;
  length: number;
  excerpt: string;
  byline: string;
  dir: string;
  siteName: string;
  lang: string;
  publishedTime: string;
}

class Processor {
  public async fetchFeed(URL: string) {
    const parser = new Parser({
      customFields: {
        item: [
          ["enclosure", "enclosure"],
          ["itunes:image", "itunesImage"],
          ["media:content", "mediaContent"],
          ["media:thumbnail", "mediaThumbnail"],
        ],
      },
    });
    try {
      const feed = await parser.parseURL(URL);
      return feed;
    } catch (error: any) {
      const err = new CustomError(
        500,
        error.message ||
          `Couldn't fetch feed from ${URL}. Check URL and try again`
      );
      logger(JSON.stringify(err));
      return null;
    }
  }
  public async fetchHTML(URL: string): Promise<string | null> {
    try {
      const response = await axios.get(URL, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          Connection: "keep-alive",
        },
        timeout: 10000,
        responseType: "text",
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const err = new CustomError(error.response.status, error.message);
        logger(JSON.stringify(err));
      } else {
        const err = new CustomError(
          400,
          `Unable to fetch HTML from provided URL. Check URL and try again.`
        );
        logger(JSON.stringify(err));
      }
      return null;
    }
  }

  public extractContent(HTML: string): Article | null {
    const dom = new JSDOM(HTML);
    const document = dom.window.document;
    document.querySelectorAll("link").forEach((el) => el.remove());
    document.querySelectorAll("script").forEach((el) => el.remove());
    document.querySelectorAll("style").forEach((el) => el.remove());
    document.querySelectorAll("*").forEach((el) => {
      if (el.hasAttribute("style")) {
        el.removeAttribute("style");
      }
    });
    document.querySelectorAll("*").forEach((el) => {
      if (el.hasAttribute("id")) {
        el.removeAttribute("id");
      }
    });
    document.querySelectorAll("*").forEach((el) => {
      if (el.hasAttribute("class")) {
        el.removeAttribute("class");
      }
    });

    const reader = new Readability(document);
    const readable = isProbablyReaderable(document);
    if (readable) {
      const article = reader.parse();

      if (article) {
        return {
          title: article.title || "",
          content: article.content || "",
          textContent: article.textContent || "",
          length: article.length || 0,
          excerpt: article.excerpt || "",
          byline: article.byline || "",
          dir: article.dir || "",
          siteName: article.siteName || "",
          lang: article.lang || "",
          publishedTime: article.publishedTime || "",
        };
      } else {
        const error = new CustomError(500, "Content could not be extracted");
        logger(JSON.stringify(error));
        return null;
      }
    } else {
      const error = new CustomError(400, "Document not readable");
      logger(JSON.stringify(error));
      return null;
    }
  }

  public findThumbnail(HTML: string, url: string): string | null {
    const $ = cheerio.load(HTML);
    let image =
      $('meta[name="image"]').attr("content") ||
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $("main img").first().attr("src") ||
      $(".main img").first().attr("src") ||
      $("#main img").first().attr("src") ||
      $("img").first().attr("src") ||
      null;
    if (image && !image.startsWith("https://")) {
      const parsedURL = new URL(url);
      image = `${parsedURL.origin}${image}`;
    }
    return image;
  }

  public findSiteName(HTML: string): string | null {
    const $ = cheerio.load(HTML);
    const script = $('script[type="application/ld+json"]').html();
    let scriptJSON;
    if (script) {
      scriptJSON = JSON.parse(script);
    }
    const schemaName: string = scriptJSON?.publisher?.name || scriptJSON?.name;
    return (
      $('meta[property="og:site_name"]').attr("content") ||
      $('meta[name="og:site_name"]').attr("content") ||
      $('meta[name="application-name"]').attr("content") ||
      $('meta[name="twitter:site:id"]').attr("content") ||
      schemaName ||
      $('meta[itemprop="name"]').attr("content") ||
      $('meta[name="apple-mobile-web-app-title"]').attr("content") ||
      null
    );
  }

  public findPublishedTime(HTML: string): string | null {
    const $ = cheerio.load(HTML);
    const script = $('script[type="application/ld+json"]').html();
    let schemaDate;
    let scriptJSON;
    if (script) {
      scriptJSON = JSON.parse(script);
    }
    schemaDate = scriptJSON?.datePublished;
    return (
      $("time").attr("datetime") ||
      $("time").text() ||
      $('meta[name="date"]').attr("content") ||
      $('meta[property="article:published_time"]').attr("content") ||
      $('meta[name="article:published_time"]').attr("content") ||
      schemaDate ||
      $('meta[name="DC.date"]').attr("content") ||
      $('meta[itemprop="datePublished"]').attr("content") ||
      $('meta[property="published_time"]').attr("content") ||
      $('meta[name="published_time"]').attr("content") ||
      null
    );
  }

  public findTitle(HTML: string): string | null {
    const $ = cheerio.load(HTML);
    const script = $('script[type="application/ld+json"]').html();
    let scriptJSON;
    if (script) {
      scriptJSON = JSON.parse(script);
    }
    const schemaHeadline = scriptJSON?.headline;
    return (
      $("title").text() ||
      $("h1").first().text() ||
      $('meta[property="og:title"]').attr("content") ||
      schemaHeadline ||
      $('meta[name="DC.title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $('meta[name="og:title"]').attr("content") ||
      null
    );
  }

  public findAuthor(HTML: string): string | null {
    const $ = cheerio.load(HTML);
    const script = $('script[type="application/ld+json"]').html();
    let scriptJSON;
    if (script) {
      scriptJSON = JSON.parse(script);
    }
    const schemaAuthor = scriptJSON?.author?.name;
    return (
      schemaAuthor ||
      $('meta[name="author"]').attr("content") ||
      $('meta[property="article:author"]').attr("content") ||
      $('meta[name="twitter:creator:id"]').attr("content") ||
      $("address").text() ||
      $("address a").text() ||
      $('[rel="author"]').first().text() ||
      null
    );
  }

  public findLength(HTML: string): number | null {
    const $ = cheerio.load(HTML);
    let articleLength = 0;
    let divLength = 0;

    $("body > article").each((_, el) => {
      articleLength += $(el).text().length;
    });
    $("body > div").each((_, el) => {
      divLength += $(el).text().length;
    });
    const mainLength = $("main").text().length;
    const bodyLength = $("body").text().length;

    return articleLength !== 0
      ? articleLength
      : divLength !== 0
      ? divLength
      : mainLength || bodyLength || null;
  }

  public getHostname(url: string): string {
    const link = new URL(url);
    const hostname = link.hostname;
    return hostname;
  }
}

export default Processor;
