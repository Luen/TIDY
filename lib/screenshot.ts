'use server';

import { chromium } from 'playwright-core';
import chromiumAWS from '@sparticuz/chromium';

export async function takeScreenshot(url: string): Promise<Buffer> {
  const isDev = process.env.NODE_ENV !== 'production';
  const executablePath = isDev
    ? undefined // Use local Chromium in development
    : await chromiumAWS.executablePath();

  const browser = await chromium.launch({
    args: chromiumAWS.args,
    executablePath,
    headless: chromiumAWS.headless === true,
  });

  try {
    const page = await browser.newPage();
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
    await browser.close();
  }
}