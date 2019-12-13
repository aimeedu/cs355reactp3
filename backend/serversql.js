const request = require('request');
const db = require('./queries')
const express = require("express");
const app = express();
const cheerio = require('cheerio');
const axios = require('axios');
const {Pool} = require("pg");
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


/** this is the data basepart move to queries.js later -------------------------------------------------------*/

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

/**this is the database part move to queries.js later --------------------------------------------------------*/



app.listen(port, () => console.log(`Server is running on port ${port}`));



/** get term from the front end user input with post method. */
app.post('/custom', (req, res) => {
    const getTerm = req.body.term;
    console.log("print term: ",getTerm);
    /** insert into Search table*/
    pool.query('INSERT INTO search (terms) VALUES ($1)', [getTerm], (error) => {
        if (error) {
            throw error
        }
    });
    /** also query the other 3 tables to get the result */
    const qureyString = `SELECT * FROM word where wordname = 'Apple'`;
    pool.query(qureyString, (err, result) => {
        // print the result form the selected table.
        console.log(result);
        // res.send(result.rows);
    })
})


// GET method route
// actual end point is http://localhost:5000/admin
app.get('/admin', db.getSearchTable);

/** insert into the page table when indexing */
app.post('/admin', (req,res)=>{
    // const getURL = req.body.inputURL;
    // let title, description, lastModified;
    // // need to fix the web crawler. for some website, it can't extracting data from certain field. try apple.com
    // axios.get(getURL).then((res) => {
    //
    //     if(res.status === 200) {
    //         const html = res.data;
    //         const $ = cheerio.load(html);
    //         title = $('title').text();
    //         if (title != null) title.trim();
    //
    //         description = $('meta[name="description"]').attr('content');
    //         if (description != null) {
    //             description.trim();
    //         } else{
    //             /* If the description is unavailable set the description to the title */
    //             description = title;
    //         }
    //         lastModified = res.headers['last-modified'];
    //     }
    //
    //     /** If the lastModified is unavailable set the lastModified to the current time stamp */
    //
    //     if (lastModified != null) {
    //         pool.query('INSERT INTO page (url, title, description, lastModified) VALUES ($1, $2, $3, $4)', [getURL, title, description, lastModified], (error) => {
    //             if (error) {
    //                 throw error
    //             }
    //         });
    //     } else {
    //         pool.query('INSERT INTO page (url, title, description, lastModified) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)', [getURL, title, description], (error) => {
    //             if (error) {
    //                 throw error
    //             }
    //         });
    //     }
    //
    // })
});


// the crawler gets all the plain text from the body of a web page --------------------------------------------------------
const URL = 'https://www.atptour.com';
let counts = {};  /** key is the actual word, not a indices */
let keys = []; /** (K, V) key is the word, and value is the count */

/** if the index not queried back yet, we need to wait lastPageID, lastWordID, lastPageWordID assigned new value other than 0. */
/** only those 3 variables get new value, we can go to crawl the web page. */

const getLastId = () => {
    /** query the last index from 3 tables, then when we insert new data, the index is continued from the last index in the table. */
    let lastPageID=0, lastWordID=0, lastPageWordID=0;
     //can not be updated.
    pool.query('SELECT MAX(pageid) FROM page;', (error, result) => {
        lastPageID = result.rows[0].max;
        console.log(lastPageID);
    });
    pool.query('SELECT MAX(wordid) FROM word;', (error, result) => {
        lastWordID = result.rows[0].max;
    });
    pool.query('SELECT MAX(pagewordid) FROM page_word;', (error, result) => {
        lastPageWordID = result.rows[0].max;
    });
    // console.log(lastPageID);
}



/** -------------------------------------------------------- */
//
// request(URL, function (err, res, body) {
//     /** 1. query the last index from 3 tables, then when we insert new data, the index is continued from the last index in the table. */
//     let lastPageID=0, lastWordID=0, lastPageWordID=0; //can not be updated.
//
//     // pool.query('SELECT MAX(pageid) FROM page;', (error, result) => {
//     //     lastPageID = result.rows[0].max;
//     // });
//     // pool.query('SELECT MAX(wordid) FROM word;', (error, result) => {
//     //     lastWordID = result.rows[0].max;
//     // });
//     // pool.query('SELECT MAX(pagewordid) FROM page_word;', (error, result) => {
//     //     lastPageWordID = result.rows[0].max;
//     // });
//
//     /** 2. after retrieve 3 last index , we call the crawler to get the data */
//
//     if(err) {
//         console.log(err, "error occured while hitting URL");
//     }
//     else {
//         const getURL = URL;
//         let $ = cheerio.load(body);
//         let txt = $('body').text();
//         let title2 = $('title').text();
//         let description2 = $('meta[name="description"]').attr('content');
//         if (description2 != null) {
//             description2.trim();
//         } else {
//             /* If the description is unavailable set the description to the title */
//             description2 = title2;
//         }
//         let lastModified2 = res.headers['last-modified'];
//
//         console.log(getURL, title2, description2, lastModified2);
//
//         setup(txt);
//         /** convert counts {  "word1": 34, "word2": 5, "word3": 1 ... } to an array of array [[word, freq], [word1, 34], [word2, 5], [word3, 1] ...] */
//         let converted = Object.entries(counts);
//         let len = converted.length;
//         const queryS = '';
//
//         pool.query(queryS, (error) => {
//             if (error) {
//                 throw error
//             }
//         })
//
//         // for (let i = lastWordID+1; i < len; i++) {
//         //     /** the code below should work fine if each time we can get last index properly */
//         //     /** if the last index is 0, we can not insert new data for the first url, because the PK must be unique.*/
//         //     pool.query('INSERT INTO page (pageid, url, title, description, lastModified) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)', [i, getURL, title2, description2], (error) => {
//         //         if (error) {
//         //             throw error
//         //         }
//         //     });
//         //     pool.query('INSERT INTO word (wordid, wordName) VALUES ($1, $2)', [i, converted[i-1][0]], (error) => {
//         //         if (error) {
//         //             throw error
//         //         }
//         //     });
//         //     pool.query('INSERT INTO page_word (wordid, freq, wordname) VALUES ($1, $2, $3)', [i, converted[i-1][1], converted[i-1][0]], (error) => {
//         //         if (error) {
//         //             throw error
//         //         }
//         //     });
//         // }
//     }
// });


function setup (txt){
    //todo: Take care of words like "can't" and "don't"
    //* It takes all the words and splits by anything that are not letters  */
    // \w+ matches 1 or more word characters (same as [a-zA-Z0-9_]+ )
    let tokens  = txt.split(/\W+/);
    for (let i = 0; i< tokens.length; i++){
        let word = tokens[i].trim();
        // This is ignoring all digits in the text, so if it is not a digit then we continue
        const pattern = new RegExp(/\d+/);
        if (!pattern.test(word) && word !== '') {
            // If a word is undefined then we add that means it hasn't appeared yet
            if (counts[word] === undefined) {
                // Since the word has appeared for the first time we make count = 1.
                counts[word] = 1;
                keys.push(word.trim()); // unique keys
            } else {
                counts[word] = counts[word] + 1;
            }
        }
    }
}




