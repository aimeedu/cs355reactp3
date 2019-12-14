//import router
const router = require('express').Router();
//require model
let Search = require('../models/search.model');
let Page = require('../models/page.model');

router.route('/').get((req, res) => {
    Search.find()
    // find method returns a promise. print all the entries from this collection.
        .then(search => res.json(search))
        .catch(err => res.status(400).json('Error: ' + err));
});

/** use this route when we trying to search for the term. put term in the query string */
// router.route('/custom/:wordname').get((req, res) => {
//     Page.find(w => w.wordname == req.params.wordname)
//         .then(w => res.json(w))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

// endpoints. post request handle insert into search table.
router.route('/').post((req, res) => {
    // const searchid, count, timetosearch ;
    const term = req.body.term;
    // console.log(term);
    /** searchdate is the default timestamps*/

    const newSearch = new Search({
        term
    });

    newSearch.save()
        .then(() => res.json('term added!'))
        .catch(err => res.status(400).json('Error: ' + err))
});

module.exports = router;