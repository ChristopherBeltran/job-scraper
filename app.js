const express = require("express");
const requestIp = require('request-ip');
const cors = require('cors')
const scraperRouter = require('./scraper_routers/scraperRouter')


require("./mongoose");

const app = express();

app.use(cors())
app.use(requestIp.mw())
app.use(express.json());

app.post('/api/v1/scraper', async (req, res) => {
    // //const providers = Object.values(req.body)
    // for (const provider of providers) {
    //     console.log('Starting web scraper for ' + provider)
    // }
    try {
        const results = await scraperRouter()
        res.send(results)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = app;