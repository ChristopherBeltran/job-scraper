const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const runLinkedIn = require('../automation_scripts/linkedin')
const runGlassdoor = require('../automation_scripts/glassdoor')
const runIndeed = require('../automation_scripts/indeed')
const runDice = require('../automation_scripts/dice')


const scraperRouter = async (request) => {

    var {
        jobTitle,
        location,
        linkedIn,
        glassdoor,
        indeed,
        dice,
        datePosted,
        sortBy
    } = request

    console.log(jobTitle)
    const results = []

    if (linkedIn) {
        try {
            const listings = await runLinkedIn(jobTitle, location, datePosted, sortBy)
            const ListingSerializer = new JSONAPISerializer('LinkedIn listings', {
                attributes: ['position', 'company', 'location', 'link']
            })

            const serializedListings = ListingSerializer.serialize(listings)

            results.push(serializedListings)

        } catch (e) {
            console.log(e)
        }


    }

    if (glassdoor) {
        try {
            const listings = await runGlassdoor(jobTitle, location, datePosted, sortBy)
            const ListingSerializer = new JSONAPISerializer('Glassdoor listings', {
                attributes: ['position', 'company', 'location', 'link']
            })

            const serializedListings = ListingSerializer.serialize(listings)

            results.push(serializedListings)

        } catch (e) {
            console.log(e)
        }
    }

    if (indeed) {
        try {
            const listings = await runIndeed(jobTitle, location, datePosted, sortBy)
            const ListingSerializer = new JSONAPISerializer('Indeed listings', {
                attributes: ['position', 'company', 'location', 'link']
            })

            const serializedListings = ListingSerializer.serialize(listings)

            results.push(serializedListings)

        } catch (e) {
            console.log(e)
        }
    }

    if (dice) {
        try {
            const listings = await runDice(jobTitle, location, datePosted, sortBy)
            const ListingSerializer = new JSONAPISerializer('Dice listings', {
                attributes: ['position', 'company', 'location', 'link']
            })

            const serializedListings = ListingSerializer.serialize(listings)

            results.push(serializedListings)

        } catch (e) {
            console.log(e)
        }
    }

    return results
}
module.exports = scraperRouter