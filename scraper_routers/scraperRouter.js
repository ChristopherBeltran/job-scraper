const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const runLinkedIn = require('../automation_scripts/linkedin')
const runGlassdoor = require('../automation_scripts/glassdoor')
const runIndeed = require('../automation_scripts/indeed')
const runDice = require('../automation_scripts/dice')


const linkedInRouter = async (request) => {

    const {
        jobTitle,
        location,
        datePosted,
        sortBy
    } = request

    const results = []

    try {
        const listings = await runLinkedIn(jobTitle, location, datePosted, sortBy)
        const ListingSerializer = new JSONAPISerializer('LinkedIn listings', {
            attributes: ['position', 'company', 'location', 'link', 'source']
        })

        const serializedListings = ListingSerializer.serialize(listings)

        results.push(serializedListings)

    } catch (e) {
        console.log(e)
    }

    return results
}

const glassdoorRouter = async (request) => {
    const {
        jobTitle,
        location,
        datePosted,
        sortBy
    } = request

    const results = []

    try {
        const listings = await runGlassdoor(jobTitle, location, datePosted, sortBy)
        const ListingSerializer = new JSONAPISerializer('Glassdoor listings', {
            attributes: ['position', 'company', 'location', 'link', 'source']
        })

        const serializedListings = ListingSerializer.serialize(listings)

        results.push(serializedListings)

    } catch (e) {
        console.log(e)
    }

    return results
}

const indeedRouter = async (request) => {
    const {
        jobTitle,
        location,
        datePosted,
        sortBy
    } = request

    const results = []

    try {
        const listings = await runIndeed(jobTitle, location, datePosted, sortBy)
        const ListingSerializer = new JSONAPISerializer('Indeed listings', {
            attributes: ['position', 'company', 'location', 'link', 'source']
        })

        const serializedListings = ListingSerializer.serialize(listings)

        results.push(serializedListings)

    } catch (e) {
        console.log(e)
    }

    return results
}

const diceRouter = async (request) => {
    const {
        jobTitle,
        location,
        datePosted,
        sortBy
    } = request

    const results = []

    try {
        const listings = await runDice(jobTitle, location, datePosted, sortBy)
        const ListingSerializer = new JSONAPISerializer('Dice listings', {
            attributes: ['position', 'company', 'location', 'link', 'source']
        })

        const serializedListings = ListingSerializer.serialize(listings)

        results.push(serializedListings)

    } catch (e) {
        console.log(e)
    }

    return results
}

module.exports = {
    linkedInRouter,
    glassdoorRouter,
    indeedRouter,
    diceRouter
}