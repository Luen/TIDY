'use server';

import { chromium } from 'playwright';

export async function takeScreenshot(url: string): Promise<Buffer> {
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.evaluate(() => {
      const fbLightMode = document.querySelector('div.__fb-light-mode');
      if (fbLightMode) {
        fbLightMode.remove();
      }
    });
    console.log(`Taking screenshot of ${url}`);
    const screenshotBuffer = await page.screenshot({ fullPage: true });
    return screenshotBuffer;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to take screenshot');
  } finally {
    await browser.close();
  }
}
