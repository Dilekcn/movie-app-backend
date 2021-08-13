const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MoviesSchema = new Schema({
	type: { type: String },
	imdb_id: { type: String },
	original_title: { type: String },
	isActive: { type: Boolean, default: true },
	isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('movies', MoviesSchema);
