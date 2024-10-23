'use server';

import { chromium } from 'playwright-core';

interface Post {
  author: string;
  content: string;
  time: string;
  imageUrl: string;
}

export async function scrapeFacebookGroup(url: string): Promise<{ buffer: Buffer, posts: Post[] }> {
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('div[aria-label="Close"]', { timeout: 10000 });
    await page.click('div[aria-label="Close"]');
    await page.evaluate(() => {
      const fbLoginPrompt = document.querySelector('div[data-nosnippet]');
      if (fbLoginPrompt) {
        fbLoginPrompt.remove();
      }
    });
    await page.evaluate(() => {
      const fbLightMode = document.querySelector('div.__fb-light-mode');
      if (fbLightMode) {
        fbLightMode.remove();
      }
    });
    await new Promise((resolve) => setTimeout(resolve, 55000));
    await page.waitForSelector('div[role="feed"]', { timeout: 10000 });
    const posts = await page.$$eval('div[role="feed"] > div', elements => {
      return elements
          .map(post => {
              // Extract the post text
              const contentElement = post.querySelector('div[dir="auto"]');
              const content = contentElement?.textContent?.trim() ?? '';
  
              // Extract the author's name if available
              const authorElement = post.querySelector('h2 strong span');
              const author = authorElement?.textContent?.trim() ?? '';
  
              // Extract post timestamp if available
              const timeElement = post.querySelector('a[aria-label*="Time"]');
              const time = timeElement?.textContent?.trim() ?? '';
  
              // Extract image URL if present
              const imageElement = post.querySelector('img');
              const imageUrl = imageElement ? imageElement.src : '';
  
              // Return the structured post object
              return { author, content, time, imageUrl };
          })
          .filter(post => post.author && post.content); // Filter out posts with blank author or content
      });
  
    console.log(posts);

    console.log(`Taking screenshot of ${url}`);
    const screenshotBuffer = await page.screenshot({ fullPage: true });

    return {
      buffer: screenshotBuffer,
      posts: posts,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to take screenshot');
  } finally {
    await browser.close();
  }
}