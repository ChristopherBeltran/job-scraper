const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const runGlassdoor = async ( /*searchParams*/ ) => {
    // const {
    //     jobTitle,
    //     location,
    //     radius,
    //     omittedTerms
    // } = searchParams

    const url = 'https://www.glassdoor.com/Job/index.htm'
    const pageLimit = 30
    const nextPage = '.next > a:nth-child(1)'

    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto(url);

    await page.focus('#KeywordSearch')
    await page.keyboard.type('Software Engineer')

    await page.focus('#LocationSearch')
    let locationInput = await page.$('#LocationSearch')
    await locationInput.click({
        clickCount: 3
    });
    await locationInput.press('Backspace');
    await page.keyboard.type('Denver, CO')

    await Promise.all([
        page.waitForNavigation({
            options: {
                waitUntil: 'load'
            }
        }),
        page.click('#HeroSearchButton'),
    ]);

    //change search to filter by last 3 days
    await page.click('#filter_fromAge')
    await page.click('.css-1dv4b0s > li:nth-child(3) > span:nth-child(1)')
    await page.waitFor(5000);
    //change search to filter by most recent
    let resultsUrl = await page.url()
    await page.goto(`${resultsUrl}&sortBy=date_desc`)
    await page.waitFor(6000)

    const radiusSelector = '#filter_radius'
    const fiveMileRadius = '.css-1dv4b0s > li:nth-child(2) > span:nth-child(1)'
    const tenMileRadius = '.css-1dv4b0s > li:nth-child(3) > span:nth-child(1)'
    const fifteenMileRadius = '.css-1dv4b0s > li:nth-child(4) > span:nth-child(1)'
    const twentyFiveMileRadius = '.css-1dv4b0s > li:nth-child(5) > span:nth-child(1)'
    const fiftyMileRadius = '.css-1dv4b0s > li:nth-child(6) > span:nth-child(1)'


    const content = await page.content();
    const $ = cheerio.load(content);

    const jobs = []

    $('.jlGrid li').each(function (i, el) {
        const company = $(el).find('.jobEmpolyerName')
        const co = $(company).text()
        const position = $(el).data('normalize-job-title')
        const location = $(el).data('job-loc')
        const jobLink = $(el).find('.jobLink')
        const link = $(jobLink).attr('href')

        jobs.push(`${position}, ${co}, ${location}, ${link}`)
    });
    for (i = 0; i < jobs.length; i++) {
        console.log(`${i+1}. ${jobs[i]}`)
        console.log('--------------------------------------------------------------------------------------------------------')
    }
    await browser.close();


}

runGlassdoor()

module.exports = runGlassdoor