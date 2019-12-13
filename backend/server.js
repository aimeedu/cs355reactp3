const mongoose = require('mongoose');
const request = require('request');
const db = require('./queries')
const express = require("express");
const app = express();
const cheerio = require('cheerio');
const axios = require('axios');

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
const pagewordRouter = require('./routes/pageword');
const usersRouter = require('./routes/users');

/** go to /custom, load methods in searchRouter */
app.use('/custom', searchRouter);
app.use('/admin', pagewordRouter);
app.use('/users', usersRouter);

app.listen(port, () => console.log(`Server is running on port ${port}`));

