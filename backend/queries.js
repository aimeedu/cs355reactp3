const {Pool} = require("pg");
require('dotenv').config();
const URL_TO_CRAWL = 'https://apple.com';
const cheerio = require('cheerio');
const axios = require('axios');

// disable Node from rejecting self-signed certificates by allowing ANY unauthorised certificate.
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

const getSearchTable = (req, res) => {
    const select = `SELECT * FROM search;`;
    pool.query(select, (err, result) => {
            // print the result form the selected table.
            // console.log(result.rows);
            res.send(result.rows);
        })
}


//fix the method
const insertData = (url) => axios.get(url).then((response) => {
    // let urlvar, title, description, lastModified;
    // if(response.status === 200) {
    //     const html = response.data;
    //     const $ = cheerio.load(html);
    //     urlvar = url;
    //     title = $('title').text();
    //     description = $('meta').filter((i, elem) => elem.attribs.name === 'description')[0].attribs.content;
    //     lastModified = response.headers['last-modified'];
    // }
    // pool.query('INSERT INTO page (url, title, description, lastModified) VALUES ($1, $2, $3, $4)', [urlvar, title, description, lastModified], (error, results) => {
    //     if (error) {
    //         throw error
    //     }
    // })
});

module.exports = {
    getSearchTable,
    insertData,
}