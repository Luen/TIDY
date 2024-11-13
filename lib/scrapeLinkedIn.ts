/*
import playwright from 'playwright';
import * as cheerio from 'cheerio';
import { format, subDays, subWeeks, subMonths, subYears } from 'date-fns';

export async function scrapeLinkedIn(profile: string) {
  // LinkedIn Credentials
  const linkedinEmail = process.env.LINKEDIN_EMAIL || '';
  const linkedinPassword = process.env.LINKEDIN_PASSWORD || '';

    if (!linkedinEmail || !linkedinPassword) {
        throw new Error('LinkedIn credentials are not set in environment variables.');
    }

  // LinkedIn company page
    const pageUrl = 'https://www.linkedin.com/company/' + profile;

  // Extract company name from URL
  const companyName = pageUrl.replace(/\/$/, '').split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '';
  console.log(`Scraping posts ${profile}`);

  // Initialize Playwright browser
  const browser = await playwright.chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Open LinkedIn login page
  await page.goto('https://www.linkedin.com/login');

  // Enter login credentials and submit
  await page.fill('#username', linkedinEmail);
  await page.fill('#password', linkedinPassword);
  await page.click('button[type="submit"]');

  // Wait for navigation to complete
  await page.waitForSelector('input.search-global-typeahead__input');

  // Navigate to the posts page of the company
  let postPageUrl = pageUrl + '/posts';
  postPageUrl = postPageUrl.replace('//posts', '/posts');
  await page.goto(postPageUrl);

  // Scroll through the page to load all posts
  const SCROLL_PAUSE_TIME = 1500;
  let lastHeight = await page.evaluate('document.body.scrollHeight');
  let noChangeCount = 0;

  while (true) {
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await page.waitForTimeout(SCROLL_PAUSE_TIME);
    const newHeight = await page.evaluate('document.body.scrollHeight');
    if (newHeight === lastHeight) {
      noChangeCount += 1;
    } else {
      noChangeCount = 0;
    }
    if (noChangeCount >= 3) {
      break;
    }
    lastHeight = newHeight;
  }

  // Get page content
  const content = await page.content();

  // Parse the page source with cheerio
  const $ = cheerio.load(content);


const containers: cheerio.Cheerio[] = [];
  $('div.feed-shared-update-v2').each(function (this: cheerio.Element) {
    const dataUrn = $(this).attr('data-urn') || '';
    if (dataUrn.includes('activity')) {
      containers.push($(this));
    }
  });

  // Helper functions

function getActualDate(dateStr: string): string {
    const today: Date = new Date();
    let pastDate: Date = today;

    if (dateStr.includes('hour')) {
        pastDate = today;
    } else if (dateStr.includes('day')) {
        const days: number = parseInt(dateStr.split(' ')[0]);
        pastDate = subDays(today, days);
    } else if (dateStr.includes('week')) {
        const weeks: number = parseInt(dateStr.split(' ')[0]);
        pastDate = subWeeks(today, weeks);
    } else if (dateStr.includes('month')) {
        const months: number = parseInt(dateStr.split(' ')[0]);
        pastDate = subMonths(today, months);
    } else if (dateStr.includes('year')) {
        const years: number = parseInt(dateStr.split(' ')[0]);
        pastDate = subYears(today, years);
    } else {
        // Assume date in 'MM-DD' or 'MM-DD-YYYY' format
        const splitDate: string[] = dateStr.split('-');
        if (splitDate.length === 2) {
            const [month, day]: string[] = splitDate.map(num => num.padStart(2, '0'));
            const year: number = today.getFullYear();
            pastDate = new Date(`${year}-${month}-${day}`);
        } else if (splitDate.length === 3) {
            const [month, day, year]: string[] = splitDate.map(num => num.padStart(2, '0'));
            pastDate = new Date(`${year}-${month}-${day}`);
        }
    }

    return format(pastDate, 'yyyy-MM-dd');
}

  function convertAbbreviatedToNumber(s: string) {
    if (s.includes('K')) {
      return parseInt((parseFloat(s.replace('K', '')) * 1000).toString());
    } else if (s.includes('M')) {
      return parseInt((parseFloat(s.replace('M', '')) * 1000000).toString());
    } else {
      return parseInt(s) || 0;
    }
  }

  function getMediaInfo(container: cheerio.Cheerio) {
    const mediaInfo = [
      { selector: 'div.update-components-video', mediaType: 'Video' },
      { selector: 'div.update-components-linkedin-video', mediaType: 'Video' },
      { selector: 'div.update-components-image', mediaType: 'Image' },
      { selector: 'article.update-components-article', mediaType: 'Article' },
      { selector: 'div.feed-shared-external-video__meta', mediaType: 'Youtube Video' },
      { selector: 'div.feed-shared-mini-update-v2.feed-shared-update-v2__update-content-wrapper.artdeco-card', mediaType: 'Shared Post' },
      { selector: 'div.feed-shared-poll.ember-view', mediaType: 'Other: Poll, Shared Post, etc' },
    ];

    for (const info of mediaInfo) {
      const element = container.find(info.selector);
      if (element.length > 0) {
        const linkElement = element.find('a[href]');
        const link = linkElement.attr('href') || 'None';
        return [link, info.mediaType];
      }
    }

    return ['None', 'Unknown'];
  }

  function getButtonText(container: cheerio.Cheerio, ariaLabelContains: string) {
    const buttons = container.find(`button[aria-label*="${ariaLabelContains}"]`);
    let buttonText = '0';

    if (buttons.length > 0) {
      const buttonIdx = buttons.length > 1 ? 1 : 0;
      buttonText = buttons.eq(buttonIdx).text().trim() || '0';
    }

    return buttonText;
  }

  // Extract post data
  const postsData = [];

  for (const container of containers) {
    // Get post text
    const postTextElement = container.find('div.feed-shared-update-v2__description-wrapper');
    const postText = postTextElement.text().trim();

    // Get media info
    const [mediaLink, mediaType] = getMediaInfo(container);

    // Get post date
    const dateElement = container.find('div.ml4.mt2.text-body-xsmall.t-black--light');
    const postDateRaw = dateElement.text().trim();
    const postDate = getActualDate(postDateRaw);

    // Reactions (likes)
    const postReactions = getButtonText(container, 'reaction');

    // Comments
    const postComments = getButtonText(container, 'comment');

    // Shares
    const postShares = getButtonText(container, 'repost');

    // Convert counts to numbers
    const reactionsNumeric = convertAbbreviatedToNumber(postReactions);
    const commentsNumeric = convertAbbreviatedToNumber(postComments);
    const sharesNumeric = convertAbbreviatedToNumber(postShares);

    // Store the data
    postsData.push({
      'Post Text': postText,
      'Media Link': mediaLink,
      'Media Type': mediaType,
      'Post Date': postDate,
      'Reactions': postReactions,
      'Comments': postComments,
      'Shares': postShares,
      'Reactions Numeric': reactionsNumeric,
      'Comments Numeric': commentsNumeric,
      'Shares Numeric': sharesNumeric,
    });
  }


  // Sort the data by reactions
  postsData.sort((a, b) => b['Reactions Numeric'] - a['Reactions Numeric']);

  return postsData;

}
*/