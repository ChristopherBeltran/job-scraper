const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const runLinkedIn = require('../automation_scripts/linkedin')


const scraperRouter = async () => {
    try {
        var listings = await runLinkedIn()
        const ListingSerializer = new JSONAPISerializer('listings', {
            attributes: ['position', 'company', 'location', 'link']
        })

        var serializedListings = ListingSerializer.serialize(listings)

        return serializedListings

    } catch (e) {
        console.log(e)
    }


}

module.exports = scraperRouter