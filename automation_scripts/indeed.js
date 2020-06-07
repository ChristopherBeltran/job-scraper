const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const runIndeed = async ( /*searchParams*/ ) => {
    // const {
    //     jobTitle,
    //     location,
    //     radius,
    //     omittedTerms
    // } = searchParams

    const url = 'https://www.indeed.com/'


    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto(url);

    await page.focus('#text-input-what')
    await page.keyboard.type('Software Engineer')

    await page.focus('#text-input-where')
    let locationInput = await page.$('#text-input-where')
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
        page.click('#whatWhereFormId > div.icl-WhatWhere-buttonWrapper > button'),
    ]);

    //change search to filter by last 3 days
    try {
        await page.waitForSelector('#popover-x > a > svg > g > path')
        await page.click('#popover-x > a > svg > g > path')
    } catch (error) {
        console.log("Opt-in popup did not fire")
    }

    //change search to filter by most recent
    let resultsUrl = await page.url()
    await page.goto(`${resultsUrl}&sort=date`)
    await page.waitFor(6000)

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

        jobs.push(`${position}, ${co}, ${location}, ${link}`)
    });
    for (i = 0; i < jobs.length; i++) {
        console.log(`${i+1}. ${jobs[i]}`)
        console.log('--------------------------------------------------------------------------------------------------------')
    }
    await browser.close();


}

runIndeed()

module.exports = runIndeed