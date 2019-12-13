
const router = require('express').Router();
let Page = require('../models/page.model');

router.route('/').get((req, res) => {
    Page.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').post((req, res) => {
    const url = req.body.inputURL;
    console.log(url);
    // const title = req.body.title;
    // const description = req.body.description;
    // const wordname = req.body.wordname;
    // const freq = Number(req.body.freq);
    // const timetoindex = Number(req.body.timetoindex);

    const newPage = new Page({
        url
        // title,
        // description,
        // wordname,
        // freq
    });

    newPage.save()
        .then(() => res.json('Page added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;