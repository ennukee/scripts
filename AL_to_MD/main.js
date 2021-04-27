/*
    ennukee / enragednuke's AniList -> MangaDex bookmark synchronizer v0.1.0

    This is a very rough script and may not work for all users. You need to manually open your own list
      (e.g. anilsit.co/mangalist/enragednuke), SCROLL TO THE BOTTOM (not all elements are loaded at first)
      then right click and Save Page As. Move that HTML file to be next to this file and rename it to `anilist.txt`

    This is NOT an updater. It will skip all titles that you already follow on MangaDex, so it is used for adding NEW
      titles ONLY.

    This also assumes your highest list on your mangalist is your Reading list (not some other custom list).

    Additional tip: If you get a lot of low confidence outputs, try changing your preferred title language (Settings > Anime & Manga)
      in your AniList settings, then redownloading your manga list. This will change how the script searches in MangaDex

    Once it finishes running, check `output.txt` that is generated alongside this file for any titles that the
      script did not touch.
*/

const puppeteer = require('puppeteer');
const jsdom = require('jsdom');
const fs = require('fs');
const path = require('path');
const stringSimilarity = require('string-similarity');

const env = require('dotenv').config()

const LATENCY_MULTIPLIER = 1.0; // modify this if you have slow internet. This will multiply any waits in the script
const LOG_ALREADY_FOLLOWED_MANGA = false; // If you want the script to log for manga that are already followed (in output.txt) adjust this

(async () => {
    // Launch puppeteer stuff, then go to the log-in screen
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setViewport({ width: 1920, height: 1080 });
    await page.goto('http://www.mangadex.org/login', { waitUntil: 'load' });

    // Enter username / password
    const userInput = await page.$('input#login_username');
    const passInput = await page.$('input#login_password');
    await userInput.focus()
    await userInput.type(env.AL_NAME, { delay: 20 });
    await passInput.focus();
    await passInput.type(env.AL_PW, { delay: 20 });

    // Click login
    const loginButton = await page.$('button#login_button');
    await loginButton.click();

    // Process given Anilist HTML and begin geting titles
    const ANILIST_MANGALIST_HTML = fs.readFileSync(path.resolve(__dirname, 'anilist.txt'), 'utf8');
    const dom = new jsdom.JSDOM(ANILIST_MANGALIST_HTML);
    const readingList = dom.window.document.querySelectorAll('.list-wrap')[0].querySelectorAll('.entry.row');

    const not_confident_titles = [];
    for (let i = 0; i < readingList.length; i++) {
        const title = readingList[i].querySelector('.title a').textContent.trim()
        const progress = readingList[i].querySelector('.progress[label="Progress"]').textContent.replace('+', '').trim().split('/')[0];

        await page.waitFor(250 * LATENCY_MULTIPLIER); // keep it nice and slow
        await page.goto(`https://mangadex.org/search?title=${title}`, { waitUntil: 'load' });
        const results = await page.$$('.manga-entry .manga_title');
        if (results.length === 0) {
            not_confident_titles.push([title, 'No search results looking for this title'])
            continue;
        } 
        const resultTexts = await Promise.all(results.map(result => page.evaluate(el => el.textContent, result)));
        const { bestMatch: { rating, target } } = stringSimilarity.findBestMatch(title, resultTexts)

        if (rating < 0.7) { 
            // If the best match of the result is not high confidence, skip it and note it for later
            not_confident_titles.push([title, `Low title match confidence rating: ${rating}`]);
            continue;
        }
        
        const [ bestMatchLink ] = await page.$x(`//a[text()='${target.replace(/['\\]/g,'')}']`);
        if (!bestMatchLink) {
            not_confident_titles.push([title, 'Unable to find exact link from best match?']);
            continue;
        }
        await bestMatchLink.click();

        // Wait for the follow button, click it, then wait for the page to reload
        try { 
            await page.waitForSelector('button.manga_follow_button', { timeout: 1000 * LATENCY_MULTIPLIER, visible: true });
        } catch (e) {
            // This manga is already followed, skipping
            if (LOG_ALREADY_FOLLOWED_MANGA) not_confident_titles.push([title, 'This title was already followed on MangaDex']);
            continue;
        }
        await page.waitFor(250 * LATENCY_MULTIPLIER); // keep it nice and slow
        const followButton = await page.$('button.manga_follow_button');
        await page.waitFor(750 * LATENCY_MULTIPLIER); // there's a slight delay on page load where a click can be unresponsive
        await followButton.click();
        await page.waitForSelector('button.btn-success.dropdown-toggle', { visible: true }) // wait for page to reload then have the new icon for "Reading"
        await page.waitFor(250 * LATENCY_MULTIPLIER); // keep it nice and slow

        const editProgress = await page.$('button#edit_progress');
        await editProgress.click();
        await page.waitForSelector('input#chapter', { visible: true });
        await page.waitFor(250 * LATENCY_MULTIPLIER); // keep it nice and slow
        const chapterCount = await page.$('input#chapter');
        await chapterCount.click({ clickCount: 3 }); // select the 0 so we don't add extra numbers on our progress
        await chapterCount.type(progress, { delay: 25 });
        const saveProgress = await page.$('button#edit_progress_button.btn-success');
        await saveProgress.click();
        await page.waitFor(250 * LATENCY_MULTIPLIER); // keep it nice and slow
    }

    console.log('Finished calculation, now saving unconfident title data to file...')
    const output_friendly_data = not_confident_titles.map(([title, reason]) => `Title: ${title}\nReason: ${reason}\n`)
    const output_header = `
    Thanks for using my script! Below are titles that the script did NOT touch for various reasons
        (e.g. it was already followed, the title didn't match well enough, or no results found). Make sure
        to manually go over these results and add them as you see fit!

    `
    fs.writeFile('output.txt', output_header + output_friendly_data.join('\n'), (err) => {
        if (err) { throw err; }
        console.log('Saved unconfident title data to output.txt')
    })
    browser.close();
})();



