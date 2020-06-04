const express = require("express");
const requestIp = require('request-ip');
require("./mongoose");

const app = express();

app.use(requestIp.mw())
app.use(express.json());

app.get('/api/v1/linkedIn', async (req, res) => {
    let baseUrl = 'https://api.linkedin.com/v1/job-search'
    try {
        //make call to linkedIn API
        res.send('Linked in stuff happening soon!')
    } catch (e) {
        res.status(500).send()
    }
})

app.get('/api/v1/indeed', async (req, res) => {
    let baseUrl = `https://api.indeed.com/ads/apisearch?publisher=${process.env.INDEED_KEY}`
    try {
        //make call to linkedIn API
        res.send('Indeed stuff happening soon!')
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

module.exports = app;