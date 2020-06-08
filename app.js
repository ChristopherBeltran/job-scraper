const express = require("express");
const requestIp = require('request-ip');
const scraperRouter = require('./scraper_routers/scraperRouter')


require("./mongoose");

const app = express();

app.use(requestIp.mw())
app.use(express.json());

app.get('/api/v1/linkedIn', async (req, res) => {
    let baseUrl = 'https://api.linkedin.com/v1/job-search'
    try {
        let authUrl = `https://www.linkedin.com/oauth/v2/accessToken?grant_type=client_credentials&client_id=${process.env.LINKEDIN_ID}&client_secret=${process.env.LINKEDIN_SECRET}`

        //make call to linkedIn API
        res.send('Linked in stuff happening soon!')
    } catch (e) {
        res.status(500).send()
    }
})

app.get('/api/v1/indeed', async (req, res) => {
    let baseUrl = `https://api.indeed.com/ads/apisearch?publisher=${process.env.INDEED_KEY}`
    try {

    } catch (e) {
        res.status(500).send()
    }
})

app.get('/api/v1/dice', async (req, res) => {
    let baseUrl = 'https://api.dice.com/jobs'
    try {
        //make call to linkedIn API
        res.send('Dice stuff happening soon!')
    } catch (e) {
        res.status(500).send()
    }
})

app.get('/api/v1/scraper', async (req, res) => {
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