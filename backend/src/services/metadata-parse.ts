import * as cheerio from 'cheerio';

export interface ArticleMetadata {
    title: string;
    description: string;
    author: {
        name: string;
        url?: string;
    };
    publishDate: Date | null;
    modifiedDate: Date | null;
    publisher: {
        name: string;
        logo?: string;
        url?: string;
    };
    category: string[];
    tags: string[];
    language: string;
    wordCount: number;
    readingTime: number;
    imageCount: number;
    canonicalUrl: string;
    socialMedia: {
        twitter?: string;
        facebook?: string;
        linkedin?: string;
    };
}


class MetadataParser {
    private readonly WORDS_PER_MINUTE = 200;

    public parse(html: string): ArticleMetadata {
				const $ = cheerio.load(html);
        return {
            ...this.parseBasicMetadata($),
            ...this.parseAuthorInfo($),
            ...this.parseDates($),
            ...this.parsePublisher($),
            ...this.parseCategories($),
            ...this.parseAnalytics($),
            ...this.parseSocialMedia($)
        };
    }

    private parseBasicMetadata($: cheerio.CheerioAPI) {
        return {
            title: this.findTitle($),
            description: this.findDescription($),
            language: $('html').attr('lang') || 'en',
            canonicalUrl: $('link[rel="canonical"]').attr('href') || ''
        };
    }

    private findTitle($: cheerio.CheerioAPI): string {
        return (
            $('meta[property="og:title"]').attr('content') ||
            $('meta[name="twitter:title"]').attr('content') ||
            $('h1').first().text() ||
            $('title').text() ||
            ''
        ).trim();
    }

    private findDescription($: cheerio.CheerioAPI): string {
        return (
            $('meta[property="og:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            $('meta[name="twitter:description"]').attr('content') ||
            ''
        ).trim();
    }

    private parseAuthorInfo($: cheerio.CheerioAPI) {
        const authorName = 
            $('meta[name="author"]').attr('content') ||
            $('.author-name').first().text() ||
            $('[rel="author"]').first().text() ||
            '';

        const authorUrl = $('[rel="author"]').attr('href') || undefined;

        return {
            author: {
                name: authorName.trim(),
                url: authorUrl
            }
        };
    }

    private parseDates($: cheerio.CheerioAPI) {
        const publishDate = this.findDate($, [
            'meta[property="article:published_time"]',
            'meta[name="publish-date"]',
            'time[pubdate]',
            '[itemprop="datePublished"]'
        ]);

        const modifiedDate = this.findDate($, [
            'meta[property="article:modified_time"]',
            'meta[name="last-modified"]',
            '[itemprop="dateModified"]'
        ]);

        return {
            publishDate,
            modifiedDate
        };
    }

    private findDate($: cheerio.CheerioAPI, selectors: string[]): Date | null {
        for (const selector of selectors) {
            const dateStr = $(selector).attr('content') || $(selector).attr('datetime');
            if (dateStr) {
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    return date;
                }
            }
        }
        return null;
    }

    private parsePublisher($: cheerio.CheerioAPI) {
        return {
            publisher: {
                name: $('meta[property="og:site_name"]').attr('content') || '',
                logo: $('meta[property="og:image"]').attr('content'),
                url: $('meta[property="og:url"]').attr('content')
            }
        };
    }

    private parseCategories($: cheerio.CheerioAPI) {
        const categories = new Set<string>();
        const tags = new Set<string>();

        // Check meta keywords
        const keywords = $('meta[name="keywords"]').attr('content');
        if (keywords) {
            keywords.split(',').forEach(tag => tags.add(tag.trim()));
        }

        // Check article tags
        $('.tags a, .categories a, [rel="category tag"]').each((_, elem) => {
            const text = $(elem).text().trim();
            if (text) tags.add(text);
        });

        // Check breadcrumbs
        $('[typeof="BreadcrumbList"] span[property="name"]').each((_, elem) => {
            const text = $(elem).text().trim();
            if (text) categories.add(text);
        });

        return {
            category: Array.from(categories),
            tags: Array.from(tags)
        };
    }

    private parseAnalytics($: cheerio.CheerioAPI) {
        const content = $('article, [role="main"], .post-content').text();
        const wordCount = content.split(/\s+/).length;
        const imageCount = $('img').length;

        return {
            wordCount,
            imageCount,
            readingTime: Math.ceil(wordCount / this.WORDS_PER_MINUTE)
        };
    }

    private parseSocialMedia($: cheerio.CheerioAPI) {
        return {
            socialMedia: {
                twitter: $('meta[name="twitter:creator"]').attr('content'),
                facebook: $('meta[property="article:author"]').attr('content'),
                linkedin: $('a[href*="linkedin.com/"]').attr('href')
            }
        };
    }
}

export default MetadataParser;