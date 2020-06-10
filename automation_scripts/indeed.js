const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const runIndeed = async (jobTitle, jobLocation, datePosted, sortBy) => {
    // const {
    //     jobTitle,
    //     location,
    //     radius,
    //     omittedTerms
    // } = searchParams

    const url = 'https://www.indeed.com/'


    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    await page.focus('#text-input-what')
    await page.keyboard.type(`${jobTitle}`)

    await page.focus('#text-input-where')
    let locationInput = await page.$('#text-input-where')
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
        page.click('#whatWhereFormId > div.icl-WhatWhere-buttonWrapper > button'),
    ]);

    await page.waitFor(4000)
    var results = await page.url()


    switch (datePosted) {
        case 'Past 24 Hours':
            await page.goto(`${results}&fromage=1`)
            await page.waitFor(6000)
            break;
        case 'Past 3 Days':
            await page.goto(`${results}&fromage=3`)
            await page.waitFor(6000)
            break;
        case 'Past 7 Days':
            await page.goto(`${results}&fromage=7`)
            await page.waitFor(6000)
            break;
        default:
            await page.goto(`${results}&fromage=1`)
            await page.waitFor(6000)
            break;
    }


    try {
        await page.waitForSelector('#popover-x > a > svg > g > path')
        await page.click('#popover-x > a > svg > g > path')
    } catch (error) {
        console.log("Opt-in popup did not fire")
    }

    var resultsUrl = await page.url()

    if (sortBy === 'Most Recent') {
        //change search to filter by most recent
        await page.goto(`${resultsUrl}&sort=date`)
        await page.waitFor(6000)
    }

    const content = await page.content();
    const $ = cheerio.load(content);

    const jobs = []

    $('.clickcard').each(function (i, el) {
        const jobTitleElement = $(el).find('.title')
        const jobTitleChildElement = $(jobTitleElement).find('a')
        const position = $(jobTitleChildElement).attr('title')

        const jobCompanyLocation = $(el).find('.sjcl')
        const jobCompanyChildElement = $(jobCompanyLocation).find('.company')
        const jobCompanyNameChildElement = $(jobCompanyChildElement).find('a')
        const co = $(jobCompanyNameChildElement).text()

        const jobLocationChildElement = $(jobCompanyLocation).find('.recJobLoc')
        const location = $(jobLocationChildElement).data('rc-loc')
        const link = $(jobTitleChildElement).attr('href')

        const jobObj = {}
        jobObj['position'] = position
        jobObj['company'] = co
        jobObj['location'] = location
        jobObj['link'] = link

        jobs.push(jobObj)
    });

    await browser.close();

    return jobs
}

module.exports = runIndeed