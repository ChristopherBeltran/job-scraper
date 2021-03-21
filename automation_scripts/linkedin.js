const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const runLinkedIn = async (jobTitle, jobLocation, datePosted, sortBy) => {

    console.log('Starting LinkedIn scrape...')
    const url = 'https://www.linkedin.com/jobs/search'


    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');
    await page.waitForTimeout(3000)
    await page.goto('https://www.linkedin.com/')
    await page.waitForTimeout(8000)
    await page.goto(`${url}?keywords=${jobTitle}&location=${jobLocation}`);
    await page.waitForTimeout(8000)

    //No Past 3 days option on LinkedIn
    const pastDay = '#TIME_POSTED_RANGE-0'
    const pastSevenDays = '#TIME_POSTED_RANGE-1'

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
    const timeDropdownButton = '[data-tracking-control-name=public_jobs_TIME_POSTED_RANGE-dropdown]'
    const timeDropdownSubmit = '[data-tracking-control-name=f_TPR-done-btn]'
    await page.content()
    await page.waitForSelector(timeDropdownButton)
    await page.click(timeDropdownButton)
    await page.click(`${postedDate}`)
    await page.click(timeDropdownSubmit)
    await page.waitForTimeout(5000);

    var resultsUrl = await page.url()

    if (sortBy === 'Most Recent') {
        //change search to filter by most recent
        await page.goto(`${resultsUrl}&sortBy=DD`)
        await page.waitForTimeout(6000)
    } else if (sortBy === 'Most Relevant') {
        await page.goto(`${resultsUrl}&sortBy=R`)
        await page.waitForTimeout(6000)
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
        jobObj['source'] = 'LinkedIn'


        jobs.push(jobObj)

    });

    await browser.close();

    console.log('Scrape complete! Preparing results...')

    return jobs

}

module.exports = runLinkedIn