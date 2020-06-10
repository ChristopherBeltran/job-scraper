const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const runLinkedIn = async (jobTitle, jobLocation, datePosted, sortBy) => {

    const url = 'https://www.linkedin.com/jobs'


    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    await page.focus('#JOBS > section.dismissable-input.typeahead-input.keywords-typeahead-input > input')
    await page.keyboard.type(`${jobTitle}`)

    await page.focus('#JOBS > section.dismissable-input.typeahead-input.location-typeahead-input > input')
    let locationInput = await page.$('#JOBS > section.dismissable-input.typeahead-input.location-typeahead-input > input')
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
        page.click('body > main > section.section.section--hero > section > div.search__tabs.isExpanded > button:nth-child(5)'),
    ]);

    //No Past 3 days option on LinkedIn
    const pastDay = '#TIME_POSTED-dropdown > fieldset > div.filter-list > ul > li:nth-child(1) > label'
    const pastSevenDays = '#TIME_POSTED-dropdown > fieldset > div.filter-list > ul > li:nth-child(2) > label'

    var postedDate

    switch (datePosted) {
        case 'Past 24 Hours':
            postedDate = pastDay
            break;
        case 'Past 3 Days':
            postedDate = pastDay
            break;
        case 'Past 7 Days':
            postedDate = pastSevenDays
            break;
        default:
            postedDate = pastDay
            break;
    }
    //change search to filter by last 3 days
    await page.waitFor(5000);
    await page.click('body > header > section > form > ul > li:nth-child(2) > div > button')
    await page.click(`${postedDate}`)
    await page.click('#TIME_POSTED-dropdown > fieldset > div.filter-button-dropdown__dropdown-actions > button')
    await page.waitFor(5000);

    var resultsUrl = await page.url()

    if (sortBy === 'Most Recent') {
        //change search to filter by most recent
        await page.goto(`${resultsUrl}&sortBy=DD`)
        await page.waitFor(6000)
    } else if (sortBy === 'Most Relevant') {
        await page.goto(`${resultsUrl}&sortBy=R`)
        await page.waitFor(6000)
    }

    const content = await page.content();
    const $ = cheerio.load(content);

    const jobs = []

    $('.jobs-search__results-list li').each(function (i, el) {
        const linkElement = $(el).find('.result-card__full-card-link')
        const link = $(linkElement).attr('href')
        const titleElement = $(el).find('h3')
        const position = $(titleElement).text()
        const locationElement = $(el).find('.job-result-card__location')
        const location = $(locationElement).text()
        const companyElement = $(el).find('h4 > a')
        const co = $(companyElement).text()

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

module.exports = runLinkedIn