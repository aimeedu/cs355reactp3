const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pagewordSchema = new Schema({
    // pagewordid: { type: Number, required: true, unique: true },
    // pageid:	{ type: Number, required: true, unique: true },
    // wordid: { type: Number, required: true, unique: true },
    //
    url	:{ type: String, required: true, trim: true },
    // title: { type: String, required: true, trim: true},
    // description: { type: String, required: true, trim: true },
    // // lastmodified: { type: Date, required: true },
    // // lastindexed: { type: Date, required: true },
    // // timetoindex	: { type: Number, required: true },
    //
    // wordname: { type: String, required: false },
    freq: { type: Number, required: true }
}, {
    timestamps: true,
});

const PageWord = mongoose.model('PageWord', pagewordSchema);
module.exports = PageWord;
