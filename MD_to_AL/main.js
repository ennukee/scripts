/*
    ennukee's MangaDex to Anilist converter

    Rough script to help convert MangaDex list data into AniList
*/

const puppeteer = require('puppeteer');
// const jsdom = require('jsdom');
const fs = require('fs');
// const path = require('path');
const fetch = require('node-fetch');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
require('dotenv').config(); // load .env files

const mangadex = require('./paths.js');
const { MD_USERNAME, MD_PASSWORD } = process.env;
const LATENCY_MULTIPLIER = 1.0;

const ANILIST_BASE_URL = 'https://graphql.anilist.co';

(async () => {
    // Launch puppeteer stuff, then go to the log-in screen
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();
    page.setViewport({ width: 1920, height: 1080 });
    await page.goto('http://www.mangadex.org/login', { waitUntil: 'load' });

    // Enter username / password
    const userInput = await page.$(mangadex.login_field);
    const passInput = await page.$(mangadex.password_field);
    await userInput.focus()
    await userInput.type(MD_USERNAME, { delay: 20 });
    await passInput.focus();
    await passInput.type(MD_PASSWORD, { delay: 20 });

    // Click login
    const loginButton = await page.$(mangadex.login_button);
    await loginButton.click();

    // Handle 2FA
    await page.waitForNavigation();

    let allLinks = []
    for (let i = 1; i <= 4; i++) {
        await page.waitFor(250 * LATENCY_MULTIPLIER);
        await page.goto(`https://mangadex.org/list/880771/0/2/${i}/`, { waitUntil: 'load' });

        await page.waitFor(2000 * LATENCY_MULTIPLIER);
        const titleElements = await page.$$(mangadex.manga_title);
        
        for (let q = 0; q < titleElements.length; q++) {
            const href = await titleElements[q].getProperty('href')
            const href2 = await href.jsonValue()
            allLinks.push(href2)
        }
    }
    
    const noMalLinks = []
    const dataPairs = []
    // for (let i = 0; i <= 0; i++) {
    for (let i = 0; i <= allLinks.length; i++) {
        await page.waitFor(250 * LATENCY_MULTIPLIER);
        if (!allLinks[i]) continue
        await page.goto(allLinks[i], { waitUntil: 'load' });

        await page.waitFor(250 * LATENCY_MULTIPLIER);
       
        const chapterProgress = await page.$eval(mangadex.current_chapter, el => el.textContent);

        const statusEye = await page.$(mangadex.chapter_status);
        const statusEl = (await statusEye.$x('..'))[0];
        const statusElClass1 = await statusEl.getProperty('className')
        const statusElClass2 = await statusElClass1.jsonValue()
        let status
        if (statusElClass2.includes('btn-success')) {
            status = 'CURRENT'
        } else if (statusElClass2.includes('btn-primary')) {
            status = 'COMPLETED'
        } else if (statusElClass2.includes('btn-warning')) {
            status = 'PAUSED'
        } else if (statusElClass2.includes('btn-danger')) {
            status = 'DROPPED'
        } else {
            console.log('--- SKIPPED ---')
            continue; // unknown status
        }

        try {
            const malLink = await page.$(mangadex.mal_link);
            const malHref1 = await malLink.getProperty('href');
            const malHref2 = await malHref1.jsonValue();
            dataPairs.push([allLinks[i], chapterProgress, status, malHref2])
        } catch(e) {
            console.log(e);
            noMalLinks.push(allLinks[i]);
            continue;
        }
    }

    fs.writeFile('NoAnilist.txt', noMalLinks.join('\n'), (err) => {
        if (err) { throw err; }
    })

    readline.question('Please visit https://anilist.co/api/v2/oauth/authorize?client_id=3991&response_type=token and enter the code you receive >>> ', async (token) => {
        const bToken = token.trim()
        console.log(bToken)

        // for (let i = 0; i <= 0; i++) {
        for (let i = 0; i < dataPairs.length; i++) {
            // rate limiting
            await new Promise(resolve => setTimeout(() => resolve(), 1000));
            const result = dataPairs[i][3].match(/https:\/\/anilist.co\/manga\/(\d+)\//);
            console.log(dataPairs[i])
            if (!result) {
                console.log('NO ID FOUND');
                continue;
            }
            const [,id] = result

            const query = `mutation {
                SaveMediaListEntry(mediaId: ${id}, status: ${dataPairs[i][2]}, progress: ${dataPairs[i][1]}) {
                    id
                    status
                    progress
                }
            }`;
            console.log(query)
            // continue
            fetch(ANILIST_BASE_URL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${bToken}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    query,
                }),
            })
                .then(res => res.json())
                .then(json => console.log(json));
        }

        

        // Close browser (finished)
        browser.close();
        readline.close();
    })
})();



