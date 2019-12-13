// //import router
// const router = require('express').Router();
// //require model
// let Pageword = require('../models/pageword.model');
//
// router.route('/').get((req, res) => {
//     Pageword.find()
//     // find method returns a promise. print all the entries from this collection.
//         .then(pageword => res.json(pageword))
//         .catch(err => res.status(400).json('Error: ' + err));
// });
//
// // endpoints
// router.route('/add').post((req, res) => {
//
//     // const filename = req.body.filename;
//     // const content = req.body.content;
//     //
//     // const newFilecontent = new Search({filename, content});
//     //
//     // newFilecontent.save()
//     //     .then(() => res.json('File added!'))
//     //     .catch(err => res.status(400).json('Error: ' + err))
// });
//
// module.exports = router;