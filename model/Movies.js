const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MoviesSchema = new Schema({
	title: { type: String },
});

module.exports = mongoose.model('movies', MoviesSchema);
