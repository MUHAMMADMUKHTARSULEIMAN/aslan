import { Readability, isProbablyReaderable } from "@mozilla/readability";
import { request } from "undici";
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

export interface Metadata {
		thumbnail: string | null;
			siteName: string | null;
			publishedTime: string | null;
			title: string | null;
			description: string | null;
			author: string | null;
			length: number | null;
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
    const { body, statusCode } = await request(URL, {
      method: "GET",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        connection: "keep-alive",
      },
    });

    if (statusCode !== 200) {
      const message =
        statusCode < 500
          ? "Check url and try again."
          : "Something went wrong. Try again later.";
      const error = new CustomError(statusCode, message);
      logger(JSON.stringify(error));
      return null;
    } else {
      return await body.text();
    }
  }

  public extractContent(HTML: string): Article | null {
    const dom = new JSDOM(HTML);
    const document = dom.window.document;

    const NOISE_SELECTORS = ["link", "script", "style"].join(", ");

    document.querySelectorAll(NOISE_SELECTORS).forEach((el) => el.remove());

    document.querySelectorAll("*").forEach((el) => {
      if (el.hasAttribute("style")) {
        el.removeAttribute("style");
      }
      if (el.hasAttribute("id")) {
        el.removeAttribute("id");
      }
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

	public findMetadata(html: string, url: string, maxLength: number): Metadata {
		const $ = cheerio.load(html);
		return {
			thumbnail: this.findThumbnail($, url),
			siteName: this.findSiteName($),
			publishedTime: this.findPublishedTime($),
			title: this.findTitle($),
			description: this.findDescription($, html, maxLength),
			author: this.findAuthor($),
			length: this.findLength($)
		}
	}

  private findThumbnail($: cheerio.CheerioAPI, url: string): string | null {
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
    if (
      image &&
      !(image.startsWith("https://") || image.startsWith("http://"))
    ) {
      const parsedURL = new URL(url);
      image = `${parsedURL.origin}${image}`;
    }
    return image;
  }

  private findSiteName($: cheerio.CheerioAPI): string | null {
    return (
      $('meta[property="og:site_name"]').attr("content") ||
      $('meta[name="og:site_name"]').attr("content") ||
      $('meta[name="application-name"]').attr("content") ||
      $('meta[name="twitter:site:id"]').attr("content") ||
      $('meta[itemprop="name"]').attr("content") ||
      $('meta[name="apple-mobile-web-app-title"]').attr("content") ||
      null
    );
  }

  private findPublishedTime($: cheerio.CheerioAPI): string | null {
    return (
      $("time").attr("datetime") ||
      $("time").text() ||
      $('meta[name="date"]').attr("content") ||
      $('meta[property="article:published_time"]').attr("content") ||
      $('meta[name="article:published_time"]').attr("content") ||
      $('meta[name="DC.date"]').attr("content") ||
      $('meta[itemprop="datePublished"]').attr("content") ||
      $('meta[property="published_time"]').attr("content") ||
      $('meta[name="published_time"]').attr("content") ||
      null
    );
  }

  private findTitle($: cheerio.CheerioAPI): string | null {
    return (
      $("h1").first().text() ||
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $('meta[name="DC.title"]').attr("content") ||
      $('meta[name="og:title"]').attr("content") ||
      $("title").text() ||
      null
    );
  }

  private findDescription($: cheerio.CheerioAPI, HTML: string, maxLength: number): string | null {
		const description =
			$('meta[name="description"]').attr("content") ||
			$('meta[property="og:description"]').attr("content") ||
			$('meta[name="og:description"]').attr("content") ||
			$('meta[name="twitter:description"]').attr("content") ||
			null;

		if (description) {
			return description;
		}

    const dom = new JSDOM(HTML);
    const document = dom.window.document;

    const HEAD_NOISE_SELECTORS = ["link", "script", "style"].join(", ");

    document
      .querySelectorAll(HEAD_NOISE_SELECTORS)
      .forEach((el) => el.remove());

    document.querySelectorAll("*").forEach((el) => {
      if (el.hasAttribute("style")) {
        el.removeAttribute("style");
      }
      if (el.hasAttribute("id")) {
        el.removeAttribute("id");
      }
      if (el.hasAttribute("class")) {
        el.removeAttribute("class");
      }
    });

    const readable = isProbablyReaderable(document);
    if (readable) {
      const BODY_NOISE_SELECTORS: string = [
        "h1, h2, h3, h4, h5, h6",
        "header",
        "footer",
        "nav",
        "aside",
        "form",
        ".sidebar",
        ".ads, .ad, .advertisement",
        "script, style",
      ].join(", ");

      const body = document.querySelector("body");

      if (body !== null) {
        body
          .querySelectorAll(BODY_NOISE_SELECTORS)
          .forEach((el) => el.remove());

        const bodyText = body.textContent
          .replace(/(\r\n|\n|\r|\t)/gm, " ")
          .replace(/\s+/g, " ")
          .trim();

        if (bodyText.length > maxLength) {
          const truncatedText = bodyText.substring(0, maxLength);
          const lastSpaceIndex = truncatedText.lastIndexOf(" ");

          const excerpt =
            lastSpaceIndex > 0
              ? truncatedText.substring(0, lastSpaceIndex)
              : truncatedText;

          return excerpt + "...";
        } else {
          return bodyText;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  private findAuthor($: cheerio.CheerioAPI): string | null {

    return (
      $('meta[name="author"]').attr("content") ||
      $('meta[property="article:author"]').attr("content") ||
      $('meta[name="twitter:creator:id"]').attr("content") ||
      $('[rel="author"]').first().text() ||
      $("address").text() ||
      $("address a").text() ||
      null
    );
  }

  private findLength($: cheerio.CheerioAPI): number | null {
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
