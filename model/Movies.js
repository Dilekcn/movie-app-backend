const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MoviesSchema = new Schema({});

module.exports = mongoose.model('movies', MoviesSchema);
