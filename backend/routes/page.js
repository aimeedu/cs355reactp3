
const router = require('express').Router();
let Page = require('../models/page.model');

router.route('/').get((req, res) => {
    Page.find()
        .then(page => res.json(page))
        .catch(err => res.status(400).json('Error: ' + err));
});

/** use this route when we trying to search for the term. put term in the query string */
// router.route('/:wordname').get((req, res) => {
//
//     const ak = Page.find(w => w[0])
//         // => w.wordname == req.params.wordname)
//     // res.json(ak);
//     console.log(ak);
//         // .then(w => res.json(w))
//         // .catch(err => res.status(400).json('Error: ' + err));
// });


router.route('/:wordname').get((req, res) => {
    let fe = req.params.wordname;

    Page.find({
        'wordname': fe
    }, function(err, result) {
        if (err) throw err;
        if (result) {
            res.json(result)
        } else {
            res.send(JSON.stringify({
                error : 'Error'
            }))
        }
    })
})


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