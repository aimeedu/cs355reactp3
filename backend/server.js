const mongoose = require('mongoose');
const request = require('request');
const db = require('./queries')
const express = require("express");
const app = express();
const cheerio = require('cheerio');
const axios = require('axios');
const router = require('express').Router();
const bodyParser = require('body-parser')



// process is a global object.
const port = process.env.PORT || 5000;
//cors: cross origin resource sharing, allowed ajax request access resource from remote host.
const cors = require('cors');
//dotenv: load environment variables form a .env file
require('dotenv').config();

// middleware
app.use(cors());
//allow us to parse json, this should work but not.
app.use(express.json());
//this is working.
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }));


const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

/** require the files */
const searchRouter = require('./routes/search');
const pageRouter = require('./routes/page');

/** go to /custom, load methods in searchRouter */
// app.use('/custom', searchRouter);
// app.use('/admin', pageRouter);

app.use('/custom', searchRouter);
app.use('/admin', pageRouter);

// router.route('/custom/:wordname').get((req, res) => {
//     pageRouter.Page.find(w => w.wordname === req.params.wordname)
//         .then(w => res.json(w))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

// const Crawler = require("js-crawler");

// const crawler = new Crawler().configure({
//     depth: 2,
// });
// crawler.crawl("https://www.wikipedia.org/", function(page) {
//     console.log(page.url);
// });

const as = [{id:1, name:"aimee"},{id:2, name:"amy"}];

app.get('/', (req, res) => {
    res.send("heo");
});


app.get('/test', (req, res) => {
    res.send(as);
});

app.get('/test/:name', (req, res) => {
    const re = as.find(a => a.name === req.params.name);
    res.send(re);
});


app.listen(port, () => console.log(`Server is running on port ${port}`));

