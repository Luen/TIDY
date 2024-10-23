'use server';

import { chromium as playwright } from 'playwright-core'
import chromium from '@sparticuz/chromium'

export const getBrowser = async () => {
  const launchConfig = {
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless === 'shell' ? false : chromium.headless,
  }

  if (process.env.NODE_ENV === 'production') {
    return await playwright.launch(launchConfig);
  }
  return await playwright.launch(launchConfig);
};

export async function takeScreenshot(url: string): Promise<Buffer> {
  let browser;
  try {
    browser = await getBrowser();
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