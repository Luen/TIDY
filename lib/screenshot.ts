import { chromium } from 'playwright';

export async function takeScreenshot(url: string): Promise<Buffer> {
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.goto(url);
    console.log(`Taking screenshot of ${url}`);
    const screenshotBuffer = await page.screenshot();
    return screenshotBuffer;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to take screenshot');
  } finally {
    await browser.close();
  }
}
