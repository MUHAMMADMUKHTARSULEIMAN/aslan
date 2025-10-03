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
    }
  }
  public async fetchHTML(URL: string): Promise<string | undefined> {
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
    }
  }

  public extractContent(HTML: string) {
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
      }
    } else {
      const error = new CustomError(400, "Document not readable");
      logger(JSON.stringify(error));
    }
  }

  public findThumbnail(HTML: string): string {
    const $ = cheerio.load(HTML);
    return (
      $('meta[name="image"]').attr("content") ||
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $("main img").first().attr("src") ||
      $(".main img").first().attr("src") ||
      $("#main img").first().attr("src") ||
      $("img").first().attr("src") ||
      ""
    );
  }

  public findSiteName(HTML: string, url: string): string {
    const $ = cheerio.load(HTML);
    const script = $('script[type="application/ld+json"]').html();
    let scriptJSON;
    if (script) {
      scriptJSON = JSON.parse(script);
    }
    const schemaName = scriptJSON?.publisher?.name || scriptJSON?.name;
    const link = new URL(url);
    const hostname = link.hostname;
    return (
      $('meta[property="og:site_name"]').attr("content") ||
      $('meta[name="og:site_name"]').attr("content") ||
      $('meta[name="application-name"]').attr("content") ||
      $('meta[name="twitter:site:id"]').attr("content") ||
      schemaName ||
      $('meta[itemprop="name"]').attr("content") ||
      $('meta[name="apple-mobile-web-app-title"]').attr("content") ||
      hostname
    );
  }

  public findPublishedTime(HTML: string) {
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
      ""
    );
  }

  public findTitle(HTML: string, url: string) {
    const $ = cheerio.load(HTML);
    const script = $('script[type="application/ld+json"]').html();
    let scriptJSON;
    if (script) {
      scriptJSON = JSON.parse(script);
    }
    const schemaHeadline = scriptJSON?.headline;
    const link = new URL(url);
    const hostname = link.hostname;
    return (
      $("title").text() ||
      $("h1").first().text() ||
      $('meta[property="og:title"]').attr("content") ||
      schemaHeadline ||
      $('meta[name="DC.title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $('meta[name="og:title"]').attr("content") ||
      hostname
    );
  }

  public findAuthor(HTML: string) {
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
      ""
    );
  }

  public findLength(HTML: string) {
    const $ = cheerio.load(HTML);
    let articleLength = 0;
    let sectionLength = 0;
    let divLength = 0;

		$("article").each((_, el) => {
			articleLength += $(el).text().length;
		});
		$("section").each((_, el) => {
			sectionLength += $(el).text().length;
		});
    $("div").each((_, el) => {
      divLength += $(el).text().length;
    });
		const mainLength = $("main").text().length
		const bodyLength = $("body").text().length

		return (
			articleLength !== 0 ? articleLength : 
			sectionLength !== 0 ? sectionLength :
			divLength !== 0 ? divLength : 
			mainLength ||
			bodyLength ||
			0
		)
  }
}

export default Processor;
