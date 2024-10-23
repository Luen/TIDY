'use server';

import chromium from '@sparticuz/chromium'
import * as playwright from 'playwright-aws-lambda';

export const getBrowser = async () => {
  const launchConfig = {
    executablePath: await chromium.executablePath(),
    headless: true
  }

  if (process.env.NODE_ENV === 'production') {
    return await playwright.launchChromium(launchConfig);
  }
  return await playwright.launchChromium(launchConfig);
};

export async function takeScreenshot(url: string): Promise<Buffer> {
  let browser;
  try {
    browser = await playwright.launchChromium({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => {
      const fbLightMode = document.querySelector('div.__fb-light-mode');
      if (fbLightMode) {
        fbLightMode.remove();
      }
    });
    const screenshotBuffer = await page.screenshot();
    return screenshotBuffer;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to take screenshot');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}