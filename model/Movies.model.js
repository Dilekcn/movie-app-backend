const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MoviesSchema = new Schema({
	type: { type: String },
	imdb_id: { type: String },
	tmdb_id: { type: String },
	imdb_rating:{ type: String },  
	original_title: { type: String },
	image_path: { type: String },
	backdrop_path: { type: String },
	runtime: { type: Number },
	genre: { type: Array }, 
	release_date: { type: String },
	isActive: { type: Boolean, default: true },
	isDeleted: { type: Boolean, default: false },   
 
}, 
{ timestamps: true }
); 
 
module.exports = mongoose.model('movie', MoviesSchema); 
 