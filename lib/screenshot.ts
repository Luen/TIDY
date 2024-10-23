import { chromium } from 'playwright-core';
import chromiumAWS from '@sparticuz/chromium';

export async function takeScreenshot(url: string): Promise<Buffer> {
  const isProduction = process.env.NODE_ENV === 'production';
  const executablePath = isProduction
    ? await chromiumAWS.executablePath()
    : undefined; // Use local Chromium in development

  // Ensure headless is a boolean
  const headless =
    typeof chromiumAWS.headless === 'boolean'
      ? chromiumAWS.headless
      : String(chromiumAWS.headless) === 'true';

  const browser = await chromium.launch({
    args: chromiumAWS.args,
    executablePath,
    headless,
  });

  try {
    const page = await browser.newPage();
    await page.goto(url);
    const screenshotBuffer = await page.screenshot();
    return screenshotBuffer;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to take screenshot');
  } finally {
    await browser.close();
  }
}
