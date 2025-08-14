import { Readability, isProbablyReaderable } from "@mozilla/readability";
import axios from "axios";
import { JSDOM } from "jsdom";
import * as cheerio from "cheerio";
import fs from "fs";

interface Article {
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

interface Details {
  title: string;
  thumbnail: string;
  siteName: string;
  readingTime: string;
}

interface Keywords extends Array<string> {}

class Processor {
  public async fetchHTML(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
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
        console.error(
          `HTTP error! Status: ${error.response.status} for URL: ${url}`
        );
        throw new Error(
          `Could not fetch content: HTTP Status ${error.response.status}`
        );
      } else {
        console.error(`Failed to fetch HTML from ${url}:`, error);
        throw new Error(
          `Could not fetch content: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  }

  public extractContent(html: string): Article {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    document.querySelectorAll("style").forEach((el) => el.remove());
    document.querySelectorAll("link").forEach((el) => el.remove());
    document.querySelectorAll("script").forEach((el) => el.remove());

    const reader = new Readability(document);
		const readable = isProbablyReaderable(document, {
			// minContentLength: 1000,
			minScore: 100,
		})
    let article;
    if (readable) {
      article = reader.parse();
    }

    if (!article) {
      throw new Error(
        "Readability.js could not extract content from the provided URI"
      );
    }

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
  }

  public extractDetails(html: string) {
    const $ = cheerio.load(html);
  }

  private findTitle($: cheerio.CheerioAPI): string {
    const rawJSON = $('script[application="ld+json"]').html();
    let title = "";
    if (rawJSON) {
      const parsedJSON = JSON.parse(rawJSON);
      title = parsedJSON.name;
    }
    return (
      $("title").text() ||
      $('meta[name="title"]').attr("content") ||
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("h1").first().text() ||
      title ||
      ""
    ).trim();
  }

  private findThumbnail($: cheerio.CheerioAPI): string {
    return (
      $('meta[name="image"]').attr("content") ||
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $(".main img").first().text() ||
      $("#main img").first().text() ||
      $("img").first().text() ||
      ""
    );
  }

  private findSiteName($: cheerio.CheerioAPI): string {
    return (
      $('meta[name="site_name"]').attr("content") ||
      $('meta[property="og:site_name"]').attr("content") ||
      $('meta[name="og:site_name"]').attr("content") ||
      $('meta[name="twitter:ste_name"]').attr("content") ||
      ""
    );
  }

  private calcualateReadingTime($: cheerio.CheerioAPI): number {
    return 0;
  }
}

export default Processor;
