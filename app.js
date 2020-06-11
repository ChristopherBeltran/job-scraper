const express = require("express");
const requestIp = require('request-ip');
const cors = require('cors')
const scraperRouter = require('./scraper_routers/scraperRouter')

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}


const app = express();

app.use(cors(corsOptions))
app.use(requestIp.mw())
app.use(express.json());

app.post('/api/v1/scraper', async (req, res) => {
    // //const providers = Object.values(req.body)
    // for (const provider of providers) {
    //     console.log('Starting web scraper for ' + provider)
    // }
    const body = req.body
    try {
        const results = await scraperRouter(body)
        res.send(results)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = app;