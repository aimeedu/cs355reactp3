const request = require('request');
const fs = require('fs');

const db = require('./queries')
const express = require("express");
const app = express();


const cheerio = require('cheerio');
const axios = require('axios');
const {Pool} = require("pg");
const bodyParser = require('body-parser')
// const router = require("express").Router;
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


// move to queries.js later -------------------------------------------------------
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// password stored as environment variable.
const PS = process.env.PS;
const config = {
    user: "pkgnjnqybwtacz",
    password: PS,
    host: "ec2-107-22-228-141.compute-1.amazonaws.com",
    port: 5432,
    database: "d8qp223qobrp87",
    ssl: true
}
const pool = new Pool(config);
// move to queries.js later --------------------------------------------------------

app.listen(port, () => console.log(`Server is running on port ${port}`));

// GET method route
// actual end point is http://localhost:5000/admin
app.get('/admin', db.getSearchTable);

app.post('/admin', (req,res)=>{
    const getURL = req.body.inputURL;
    let title, description, lastModified;
    // need to fix the web crawler. for some website, it can't extracting data from certain field. try apple.com
    axios.get(getURL).then((res) => {

        if(res.status === 200) {
            const html = res.data;
            const $ = cheerio.load(html);
            title = $('title').text();
            if (title != null) title.trim();

            description = $('meta[name="description"]').attr('content');
            if (description != null) {
                description.trim();
            } else{
                /* If the description is unavailable set the description to the title */
                description = title;
            }
            lastModified = res.headers['last-modified'];
        }

        // /*If the lastModified is unavailable set the lastModified to the current time stamp */

        /* We retrieve the current time from the webpage when it was last modified, if the page
        * does not have a lastModified value hence it is null we have two cases
        * where if it is null we allow it to be a default value to be Current_Timestamp
        * else it is the default time-stamp of the webpage's host time*/
        if (lastModified != null) {
            pool.query('INSERT INTO page (url, title, description, lastModified) VALUES ($1, $2, $3, $4)', [getURL, title, description, lastModified], (error) => {
                if (error) {
                    throw error
                }
            });
        } else {
            pool.query('INSERT INTO page (url, title, description, lastModified) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)', [getURL, title, description], (error) => {
                if (error) {
                    throw error
                }
            });
        }

    })
});

// get search result.
app.get('/custom', (req, res) => {

})

// the crawler gets all the plain text from the body of a web page --------------------------------------------------------
const URL = 'https://en.wikipedia.org/wiki/London';
let counts = {};
let keys = [];
/** We create an array parsedWords which stores the words into an array
 * which will be used later to insert into the database based on their indices */
let parsedWords = [];

const countWords = request(URL, function (err, res, body) {
    if(err) {
        console.log(err, "error occured while hitting URL");
    }
    else {
        let $ = cheerio.load(body);
        let txt = $('body').text();
        setup(txt);
        // Loops through all the words in the array of parsedWords for each word in their indices
        // It inserts into the database
        for (let i = 0; i < parsedWords.length; i++) {
            pool.query('INSERT INTO word (wordName) VALUES ($1)', [parsedWords[i]], (error) => {
                if (error) {
                    throw error
                }
            });
            pool.query('INSERT INTO page_word (wordname) VALUES ($1)', [parsedWords[i]], (error) => {
                if (error) {
                    throw error
                }
            });
        }
        for(let i = 0; i<counts.length; i++) {
            pool.query('INSERT INTO page_word (freq) VALUES ($1)', [counts[i]], (error) => {
                if (error) {
                    throw error
                }
            });
        }
    }
});


function setup (txt){
    //todo: Take care of words like "can't" and "don't"
    //* It takes all the words and splits by anything that are not letters  */
    let tokens  = txt.split(/\W+/);
    for (let i = 0; i< tokens.length; i++){
        let word = tokens[i].trim();//.toLowerCase();
        // This is ignoring all digits in the text, so if it is not a digit then we continue
        const pattern = new RegExp(/\d+/);
        if (!pattern.test(word)) {
            // If a word is undefined then we add that means it hasn't appeared yet
            if (counts[word] === undefined) {
                // Since the word has appeared for the first time we make count = 1.
                counts[word] = 1;
                keys.push(word.trim());
                parsedWords.push(word);
            } else {
                counts[word] = counts[word] + 1;
            }
        }
    }
}




