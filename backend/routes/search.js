//import router
const router = require('express').Router();
//require model
let Search = require('../models/search.model');

router.route('/').get((req, res) => {
    Search.find()
    // find method returns a promise. print all the entries from this collection.
        .then(search => res.json(search))
        .catch(err => res.status(400).json('Error: ' + err));
});

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