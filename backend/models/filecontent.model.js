const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contentSchema = new Schema({
    filename: { type: String, required: true },
    content: { type: String, required: true }
}, {
    timestamps: true,
});

const Filecontent = mongoose.model('Filecontent', contentSchema);
module.exports = Filecontent;
