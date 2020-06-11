const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const runGlassdoor = async (jobTitle, jobLocation, datePosted, sortBy) => {
    // const {
    //     jobTitle,
    //     location,
    //     radius,
    //     omittedTerms
    // } = searchParams

    const url = 'https://www.glassdoor.com/Job/index.htm'
    const pageLimit = 30
    const nextPage = '.next > a:nth-child(1)'

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    await page.focus('#KeywordSearch')
    await page.keyboard.type(`${jobTitle}`)

    await page.focus('#LocationSearch')
    let locationInput = await page.$('#LocationSearch')
    await locationInput.click({
        clickCount: 3
    });
    await locationInput.press('Backspace');
    await page.keyboard.type(`${jobLocation}`)

    await Promise.all([
        page.waitForNavigation({
            options: {
                waitUntil: 'load'
            }
        }),
        page.click('#HeroSearchButton'),
    ]);

    var results = await page.url()

    switch (datePosted) {
        case 'Past 24 Hours':
            await page.goto(`${results}&fromAge=1`)
            await page.waitFor(10000)
            break;
        case 'Past 3 Days':
            await page.goto(`${results}&fromAge=3`)
            await page.waitFor(10000)
            break;
        case 'Past 7 Days':
            await page.goto(`${results}&fromAge=7`)
            await page.waitFor(10000)
            break;
        default:
            await page.goto(`${results}&fromAge=1`)
            await page.waitFor(10000)
            break;
    }

    var resultsUrl = await page.url()

    if (sortBy === 'Most Recent') {
        //change search to filter by most recent
        await page.goto(`${resultsUrl}&sortBy=date_desc`)
        await page.waitFor(6000)
    }

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

        const jobObj = {}
        jobObj['position'] = position
        jobObj['company'] = co
        jobObj['location'] = location
        jobObj['link'] = link
        jobObj['source'] = 'Glassdoor'


        jobs.push(jobObj)
    });

    await browser.close();

    return jobs
}

module.exports = runGlassdoor