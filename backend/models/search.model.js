const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const searchSchema = new Schema({
    searchid: { type: Number, required: true, unique: true },
    terms: { type: String, required: true, trim: true },
    count: { type: Number, required: false },
    searchdate: { type: Date, required: false },
    timetosearch: { type: Number, required: false }
}, {
    timestamps: true,
});

const Search = mongoose.model('PageWord', searchSchema);
module.exports = Search;
