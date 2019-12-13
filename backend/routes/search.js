//import router
const router = require('express').Router();
//require model
let Search = require('../models/search.model');

router.route('/').get((req, res) => {
    Search.find()
    // find method returns a promise. print all the entries from this collection.
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Error: ' + err));
});

// endpoints. post request handle insert into search table.
router.route('/add').post((req, res) => {
    const search = req.body.search;

    const newSearch = new Search({search});

    newSearch.save()
        .then(() => res.json('Search result added!'))
        .catch(err => res.status(400).json('Error: ' + err))
});

module.exports = router;