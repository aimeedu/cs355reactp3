const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema({
    url: { type: String, required: false, trim: true, default: "https://www.apple.com"},
    title: { type: String, required: false, trim: true, default: "Default Title"},
    description: { type: String, required: false, trim: true, default: "Default Description"},
    wordname: { type: String, required: false, trim: true, default: "aimee"},
    freq: { type: Number, required: false, default: 6},
    timetoindex: { type: Number, required: false, default: 0.00011},
}, {
    timestamps: true,
});

pageSchema.index({ wordname: 'text' });

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;