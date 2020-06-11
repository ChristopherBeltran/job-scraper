const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const runDice = async (jobTitle, jobLocation, datePosted, sortBy) => {

    const url = 'https://www.dice.com/'

    const browser = await puppeteer.launch({
        args: [
            '--start-maximized',
        ],
        defaultViewport: null
    });
    const page = await browser.newPage();
    await page.goto(url);

    await page.focus('input.ng-tns-c31-0')
    await page.keyboard.type(`${jobTitle}`)

    await page.focus('#google-location-search')
    await page.keyboard.type(`${jobLocation}`)

    await Promise.all([
        page.waitForNavigation({
            options: {
                waitUntil: 'domcontentloaded'
            }
        }),
        page.click('#submitSearch-button'),
    ]);

    await page.waitFor(6000)

    var resultsUrl = await page.url()
    switch (datePosted) {
        case 'Past 24 Hours':
            await page.goto(`${resultsUrl}&filters.postedDate=ONE`)
            await page.waitFor(6000)
            break;
        case 'Past 3 Days':
            await page.goto(`${resultsUrl}&filters.postedDate=THREE`)
            await page.waitFor(6000)
            break;
        case 'Past 7 Days':
            await page.goto(`${resultsUrl}&filters.postedDate=SEVEN`)
            await page.waitFor(6000)
            break;
        default:
            await page.goto(`${resultsUrl}&filters.postedDate=ONE`)
            await page.waitFor(6000)
            break;
    }

    const content = await page.content();
    const $ = cheerio.load(content);

    const jobs = []

    $('.card-header').each(function (i, el) {
        const titleAndLinkElement = $(el).find('.card-title-link')
        const link = $(titleAndLinkElement).attr('href')
        const position = $(titleAndLinkElement).text()
        const companyElement = $(el).find('.card-company')
        const companyChildElement = $(companyElement).find('a')
        const co = $(companyChildElement).text()
        const locationElement = $(companyElement).find('#searchResultLocation')
        const location = $(locationElement).text()

        const jobObj = {}
        jobObj['position'] = position
        jobObj['company'] = co
        jobObj['location'] = location
        jobObj['link'] = link
        jobObj['source'] = 'Dice'

        jobs.push(jobObj)
    });

    await browser.close();
    return jobs
}

module.exports = runDice