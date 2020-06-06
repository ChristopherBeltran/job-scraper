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

    const browser = await puppeteer.launch();
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

    const content = await page.content();
    const $ = cheerio.load(content);

    const jobs = []
    $('div[class=".card-header"]').find('div > div > div > div > h5 > a').each(function (index, element) {
        jobs.push(element)
    })


    return $



}

module.exports = runDice