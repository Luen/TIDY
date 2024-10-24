'use server';

import { expect } from '@playwright/test';
import { chromium } from 'playwright-core';
import fs from 'fs';

const cookiesPath = 'facebook-cookies.json';

interface Post {
  author: string;
  content: string;
  time: string;
  imageUrl: string;
}

export async function scrapeFacebookGroup(url: string): Promise<{ buffer: Buffer; posts: Post[] }> {
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    console.log('Scraping Facebook', url);
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });

    const page = await context.newPage();

    // If cookies exist, load them
    if (fs.existsSync(cookiesPath)) {
      const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf-8'));
      await context.addCookies(cookies);
    }
    
    await page.goto(url, { waitUntil: 'networkidle' });

    const loginPrompt = await page.locator("text=You must log in to continue.").first();
    if (await loginPrompt.count() > 0) {
      // Delete cookies file, if exists, as they are invalid
      if (fs.existsSync(cookiesPath)) {
        console.log('Deleting invalid cookies file...');
        fs.unlinkSync(cookiesPath);
      }
      console.log("'You must log in to continue.' message found. Attempting to log in...");

      // Retrieve Facebook credentials from environment variables
      const email = process.env.FACEBOOK_EMAIL;
      const password = process.env.FACEBOOK_PASSWORD;
      if (!email || !password) {
        throw new Error('Facebook credentials are not set in environment variables.');
      }

      // Fill in login form and submit
      await page.fill('input#email', email);
      await page.fill('input#pass', password);
      await page.click('button[name="login"]');

      // Wait for the login process to complete
      const locator = page.locator('h1[dir="auto"].html-h1').first();
      await expect(locator).toHaveText('TIDY Up Townsville Group');

      await new Promise((resolve) => setTimeout(resolve, 1000*5));

      // Check if login was successful
      const loginPrompt = await page.locator("text=You must log in to continue.").first();
      if (await loginPrompt.count() > 0) {
        console.log("'You must log in to continue.' message still found after login attempt. Aborting...");
        return { buffer: Buffer.from(''), posts: [] };
      } else {
        // Save Facebook login cookies
        const cookies = await context.cookies();
        fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));
      }
    }

    // Remove login prompt or any modal if present
    await page.evaluate(() => {
      const modal = document.querySelector('div[aria-label="Close"]');
      if (modal) {
        (modal as HTMLElement).click();
        const fbLoginPrompt = document.querySelector('div[data-nosnippet]');
        if (fbLoginPrompt) {
          fbLoginPrompt.remove();
        }
      }
    });
    await page.evaluate(() => {
      const fbLightMode = document.querySelector('div.__fb-light-mode');
      if (fbLightMode) {
        fbLightMode.remove();
      }
    });
    await new Promise((resolve) => setTimeout(resolve, 1000*75));
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight*2);
    });

    // Wait for the feed to load and extract posts
    await page.waitForSelector('div[role="feed"]', { timeout: 5000 });
    const posts = await page.$$eval('div[role="feed"] > div', elements => {
      return elements
        .map(post => {
          const contentElement = post.querySelector('div[dir="auto"]');
          let content = contentElement?.textContent?.trim() ?? '';
          const seeMore = 'See more';
          if (content.endsWith(seeMore)) {
            content = content.slice(0, content.length - seeMore.length).trim();
          }

          const authorElement = post.querySelector('h2 strong span');
          const author = authorElement?.textContent?.trim() ?? '';

          const timeElement = post.querySelector('a[aria-label*="Time"]');
          const time = timeElement?.textContent?.trim() ?? '';

          const imageElement = post.querySelector('img');
          const imageUrl = imageElement ? (imageElement as HTMLImageElement).src : '';

          return { author, content, time, imageUrl };
        })
        .filter(post => post.author && post.content);
    });

    // Take a screenshot of the page
    const screenshotBuffer = await page.screenshot({ fullPage: true });

    return {
      buffer: screenshotBuffer,
      posts: posts,
    };
  } catch (error) {
    console.error('An error occurred during scraping:', error);
    throw new Error('Failed to scrape the Facebook group.');
  } finally {
    await browser.close();
  }
}
