import { chromium } from 'playwright-core';
import chromiumAWS from '@sparticuz/chromium';

export async function takeScreenshot(url: string): Promise<Buffer> {
  // Detect if we're in the build phase
  const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
  if (isBuild) {
    // Return a placeholder image or empty buffer during build
    return Buffer.from('');
  }

  const isVercel = !!process.env.VERCEL;
  const executablePath = isVercel
    ? await chromiumAWS.executablePath()
    : undefined; // Use local Chromium in development

  const headless = true; // Ensure headless is a boolean

  const browser = await chromium.launch({
    args: chromiumAWS.args,
    executablePath,
    headless,
  });

  try {
    const page = await browser.newPage();
    console.log(`Taking screenshot of ${url}`);
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
