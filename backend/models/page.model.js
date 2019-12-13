const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema({
    url: { type: String, required: false, trim: true, },
    title: { type: String, required: false, trim: true, },
    description: { type: String, required: false, trim: true },
    wordname: { type: String, required: false, trim: true },
    freq: { type: Number, required: false, },
    timetoindex: { type: Number, required: false },
}, {
    timestamps: true,
});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;