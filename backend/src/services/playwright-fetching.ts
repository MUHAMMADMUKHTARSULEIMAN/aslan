import { chromium } from 'playwright';

async function fetchArticle(url: string): Promise<string> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

  // Medium often stores the content in <article>
  const content = await page.locator('html').innerHTML();

  await browser.close();
	return content
}

export default fetchArticle;
