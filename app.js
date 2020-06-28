const express = require("express");
const requestIp = require('request-ip');
const cors = require('cors')
const scraperRouter = require('./scraper_routers/scraperRouter.js')
const linkedInRouter = scraperRouter.linkedInRouter
const glassdoorRouter = scraperRouter.glassdoorRouter
const diceRouter = scraperRouter.diceRouter
const indeedRouter = scraperRouter.indeedRouter


var corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200
}


const app = express();

app.use(cors())
app.use(requestIp.mw())
app.use(express.json());


app.post('/api/v1/linkedin', async (req, res) => {
    const body = req.body
    try {
        const results = await linkedInRouter(body)
        res.send(results)
    } catch (e) {
        res.status(500).send()
    }
})

app.post('/api/v1/glassdoor', async (req, res) => {
    const body = req.body
    try {
        const results = await glassdoorRouter(body)
        res.send(results)
    } catch (e) {
        res.status(500).send()
    }
})

app.post('/api/v1/indeed', async (req, res) => {
    const body = req.body
    try {
        const results = await indeedRouter(body)
        res.send(results)
    } catch (e) {
        res.status(500).send()
    }
})

app.post('/api/v1/dice', async (req, res) => {
    const body = req.body
    try {
        const results = await diceRouter(body)
        res.send(results)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = app;