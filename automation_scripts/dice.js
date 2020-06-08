const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const runDice = async ( /*searchParams*/ ) => {
    // const {
    //     jobTitle,
    //     location,
    //     radius,
    //     omittedTerms
    // } = searchParams

    const url = 'https://www.dice.com/'

    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto(url);

    await page.focus('input.ng-tns-c31-0')
    await page.keyboard.type('Software Engineer')

    await page.focus('#google-location-search')
    await page.keyboard.type('Denver, CO, USA')

    await Promise.all([
        page.waitForNavigation({
            options: {
                waitUntil: 'domcontentloaded'
            }
        }),
        page.click('#submitSearch-button'),
    ]);
    const pastThreeDays = '#facets > dhi-accordion.facet-group.ng-tns-c74-5.ng-star-inserted > div.facet-body.ng-tns-c74-5.ng-trigger.ng-trigger-expand > div > js-single-select-filter > div > div > button:nth-child(3)'
    const pastSevenDays = '#facets > dhi-accordion.facet-group.ng-tns-c74-5.ng-star-inserted > div.facet-body.ng-tns-c74-5.ng-trigger.ng-trigger-expand > div > js-single-select-filter > div > div > button:nth-child(4)'

    await page.waitFor(6000)

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

        jobs.push(`${position}, ${co}, ${location}, ${link}`)
    });
    for (i = 0; i < jobs.length; i++) {
        console.log(`${i+1}. ${jobs[i]}`)
        console.log('--------------------------------------------------------------------------------------------------------')
    }


    await browser.close();



}

runDice()

module.exports = runDice