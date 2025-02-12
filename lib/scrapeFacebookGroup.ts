'use server';

import { expect } from '@playwright/test';
import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const cookiesPath = path.join(__dirname, '..', 'facebook-cookies.json');
const postsPath = path.join(__dirname, '..', 'facebook-posts.json');
const imagesDir = path.join(__dirname, '..', 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

interface Post {
  postLink: string;
  author: string;
  content: string;
  timestamp: string;
  imageUrls: string[];
}

export async function scrapeFacebookGroup(url: string): Promise<{ posts: Post[] }> {
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    console.log('Scraping Facebook', url);
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });

    const page = await context.newPage();

    // Load cookies if they exist
    if (fs.existsSync(cookiesPath)) {
      console.log('Loading cookies...');
      const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf-8'));
      await context.addCookies(cookies);
    }
    
    await page.goto(url, { waitUntil: 'networkidle' });

    // Check if login is required
    const loginPrompt1 = await page.locator("text=You must log in to continue.").first();
    const loginPrompt2 = await page.locator("text=See more on Facebook").first();
    if (await loginPrompt1.count() > 0 || await loginPrompt2.count() > 0) {
      if (fs.existsSync(cookiesPath)) fs.unlinkSync(cookiesPath);
      console.log("Log in prompt found. Attempting to log in...");

      const email = process.env.FACEBOOK_EMAIL;
      const password = process.env.FACEBOOK_PASSWORD;
      if (!email || !password) throw new Error('Facebook credentials are not set in environment variables.');

      async function closeModalIfPresent(page: import('playwright-core').Page): Promise<void> {
        const closeButtonSelector: string = '[aria-label="Close"][role="button"]';
        // Check if the close button exists
        if (await page.$(closeButtonSelector)) {
          await page.click(closeButtonSelector);
          console.log('Closed the login modal.');
        } else {
          console.log('Login modal close button not found.');
        }
      }
      await closeModalIfPresent(page);

      // Helper function to fill input fields
      async function fillField(selectors: string[], value: string) {
        for (const selector of selectors) {
          if (await page.$(selector)) {
            await page.fill(selector, value);
            return true;
          }
        }
        return false;
      }

      // Possible selectors for the email field
      const emailSelectors = [
        'input#email',
        'input[name="email"]',
        'input[type="text"][name="email"]',
        'input[type="email"]',
        'input[name="username"]',
        'input[type="text"]',
      ];

      // Possible selectors for the password field
      const passwordSelectors = [
        'input#pass',
        'input[name="pass"]',
        'input[type="password"][name="pass"]',
        'input[type="password"]',
      ];

      // Fill the email field
      const emailFilled = await fillField(emailSelectors, email);
      if (!emailFilled) {
        throw new Error('Email input field not found.');
      }

      // Fill the password field
      const passwordFilled = await fillField(passwordSelectors, password);
      if (!passwordFilled) {
        throw new Error('Password input field not found.');
      }

      // Possible selectors for the login button
      const loginButtonSelectors = [
        'button[name="login"]',
        'div[aria-label="Log in"]',
        'span[name="Log in"]',
        'button[type="submit"]',
        'button',
        'input[type="submit"]',
      ];

      // Click the login button
      let loginButtonClicked = false;
      for (const selector of loginButtonSelectors) {
        if (await page.$(selector)) {
          // Wait for navigation after clicking login
          await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            page.click(selector)
          ]);
          loginButtonClicked = true;
          break;
        }
      }
      if (!loginButtonClicked) {
        throw new Error('Login button not found.');
      }

      // Wait a moment for any redirects to complete
      await page.waitForTimeout(5000);

      // Debug: Save the page HTML to a file
      const debugHtml = await page.content();
      fs.writeFileSync(path.join(__dirname, '..', 'debug-page.html'), debugHtml);
      console.log('Debug HTML saved to debug-page.html');
      
      // Debug: Log all h1 elements and save to file
      try {
        const allH1s = await page.evaluate(() => {
          const h1Elements = document.querySelectorAll('h1');
          return Array.from(h1Elements).map(el => ({
            text: el.innerText,
            html: el.innerHTML,
            attributes: Object.fromEntries([...el.attributes].map(attr => [attr.name, attr.value]))
          }));
        });
        
        fs.writeFileSync(
          path.join(__dirname, '..', 'debug-h1s.json'), 
          JSON.stringify(allH1s, null, 2)
        );
        console.log('H1 elements debug info saved to debug-h1s.json');
      } catch (error) {
        console.error('Error capturing H1 elements:', error);
      }

      // Save current page state
      const debugInfo = {
        url: page.url(),
        title: await page.title(),
        timestamp: new Date().toISOString()
      };
      fs.writeFileSync(
        path.join(__dirname, '..', 'debug-error.json'),
        JSON.stringify(debugInfo, null, 2)
      );
      
      // Try to find the group title with a more flexible approach
      const groupTitleLocator = page.locator('h1');
      const titleCount = await groupTitleLocator.count();
      if (titleCount > 0) {
        for (let i = 0; i < titleCount; i++) {
          const titleText = await groupTitleLocator.nth(i).textContent();
          if (titleText?.includes('TIDY Up Townsville')) {
            console.log('Found group title:', titleText);
            break;
          }
        }
      }

      // Check if we're still on a login page
      const loginStillRequired = await page.locator("text=You must log in to continue.").count();
      if (loginStillRequired > 0) {
        console.log('Login still required after attempt');
        return { posts: [] };
      }
      
      const cookies = await context.cookies();
      fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));
    }

    await page.evaluate(() => {
      const modal = document.querySelector('div[aria-label="Close"]');
      if (modal) (modal as HTMLElement).click();
    });
    
    console.log('Waiting for feed to load...');
    
    // Save debug info before waiting for feed
    const preFeedDebug = {
      url: page.url(),
      title: await page.title(),
      html: await page.content()
    };
    fs.writeFileSync(
      path.join(__dirname, '..', 'debug-pre-feed.json'),
      JSON.stringify(preFeedDebug, null, 2)
    );

    // Try multiple selectors that might indicate we're on the group page
    const possibleSelectors = [
      'div[role="feed"]',
      'div[role="main"]',
      '[aria-label="Timeline"]',
      '[aria-label="Content"]',
      'div[data-pagelet="GroupFeed"]'
    ];

    let feedFound = false;
    for (const selector of possibleSelectors) {
      try {
        console.log(`Trying to find selector: ${selector}`);
        await page.waitForSelector(selector, { timeout: 5000 });
        console.log(`Found selector: ${selector}`);
        feedFound = true;
        break;
      } catch (error) {
        console.log(`Selector ${selector} not found`);
      }
    }

    if (!feedFound) {
      console.error('Could not find any feed-related elements. Current page state:');
      const debugState = {
        url: page.url(),
        title: await page.title(),
        visibleElements: await page.evaluate(() => {
          return Array.from(document.querySelectorAll('*'))
            .filter(el => el.getBoundingClientRect().height > 0 && el.getBoundingClientRect().width > 0)
            .map(el => ({
              tag: el.tagName,
              id: el.id,
              className: el.className,
              role: el.getAttribute('role'),
              ariaLabel: el.getAttribute('aria-label')
            }));
        })
      };
      fs.writeFileSync(
        path.join(__dirname, '..', 'debug-feed-error.json'),
        JSON.stringify(debugState, null, 2)
      );
      throw new Error('Could not find feed element after login');
    }

    // If we found the feed, proceed with scrolling
    console.log('Feed found, starting to scroll...');
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight*2);
      });
      console.log(`Scroll iteration ${i + 1}/10 completed`);
    }

    const posts = await page.$$eval('div[role="feed"] > div', elements => {
      
      function parseTimeToTimestamp(time: string): string {
        const currentDate = new Date();

        const timeAgoMatch = time.match(/^(\d+)([hdm])$/);
        if (timeAgoMatch) {
          const value = parseInt(timeAgoMatch[1], 10);
          const unit = timeAgoMatch[2];

          switch (unit) {
            case 'h': currentDate.setHours(currentDate.getHours() - value); break;
            case 'd': currentDate.setDate(currentDate.getDate() - value); break;
            case 'm': currentDate.setMinutes(currentDate.getMinutes() - value); break;
          }
          return Math.floor(currentDate.getTime() / 1000).toString();
        }

        const specificTimeMatch = time.match(/^(\d{1,2}):(\d{2})\s?([AaPp][Mm])?$/);
        if (specificTimeMatch) {
          const hours = parseInt(specificTimeMatch[1], 10);
          const minutes = parseInt(specificTimeMatch[2], 10);
          const period = specificTimeMatch[3]?.toUpperCase();
          currentDate.setHours(period === 'PM' && hours < 12 ? hours + 12 : hours % 12, minutes, 0, 0);
          return Math.floor(currentDate.getTime() / 1000).toString();
        }

        return Math.floor(currentDate.getTime() / 1000).toString();
      }

      return elements.map(post => {
        const contentElement1 = post.querySelector('div[dir="auto"]');
        const contentElement2 = post.querySelector('div[data-ad-preview="message"]');
        const contentElement = contentElement1 || contentElement2;
        const content = contentElement?.innerHTML?.replace(/<[^>]+>/g, '').trim() ?? '';

        const authorElement1 = post.querySelector('h2 strong span');
        const authorElement2 = post.querySelector('a[href*="groups/1044042929275742/user"] span');
        const authorElement = authorElement1 || authorElement2;
        const author = authorElement?.textContent?.trim() ?? '';

        const timeText = Array.from(post.querySelectorAll('div span'))
          .map(link => link.textContent?.trim() ?? '')
          .find(text => /^\d+[hmd]$/.test(text) || /^\d{1,2}:\d{2}\s?[AaPp][Mm]$/.test(text)) ?? '';
        const timestamp = parseTimeToTimestamp(timeText);

        const postLinkElements = Array.from(post.querySelectorAll('a[role="link"][href*="facebook.com"]'));
        const postLink = postLinkElements.find(el => el.getAttribute('href')?.includes('/permalink/'))?.getAttribute('href') || '';

        const imageUrls = Array.from(post.querySelectorAll('img'))
          .map(image => image.src)
          .filter(src => src.startsWith('https://scontent'));
        
        return { postLink, author, content, timestamp, imageUrls };
      }).filter(post => post.author && post.content);
    });

    console.log('Scraped', posts.length, 'posts');
    
    function fetchImage(url: string, filepath: string) {
      fetch(url)
        .then(res => res.arrayBuffer())
        .then(buffer => {
          fs.writeFileSync(filepath, Buffer.from(buffer));
          console.log(`Image saved at ${filepath}`);
        })
        .catch(err => console.error(`Failed to save image ${url}:`, err));
    }
    function saveImageLocally(url: string): string {
      const filename = path.basename(url).split('?')[0];
      const filepath = path.join(imagesDir, filename);
      if (!fs.existsSync(filepath)) {
        fetchImage(url, filepath);
      }
      return url;
    }    
    for (const post of posts) {
      post.imageUrls = post.imageUrls.map(url => saveImageLocally(url));
    }

    const previousPosts = fs.existsSync(postsPath) ? JSON.parse(fs.readFileSync(postsPath, 'utf-8')) : [];
    const uniquePosts = [...previousPosts, ...posts].reduce((acc: Post[], post: Post) => {
      if (!acc.find(item => item.postLink === post.postLink)) acc.push(post);
      return acc;
    }, []);

    fs.writeFileSync(postsPath, JSON.stringify(uniquePosts, null, 2));
    console.log('Posts saved successfully at:', postsPath);

    return { posts: uniquePosts };
  } catch (error) {
    console.error('An error occurred during scraping:', error);
    return { posts: [] };
  } finally {
    await browser.close();
  }
}