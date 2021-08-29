const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MoviesSchema = new Schema({
	type: { type: String },
	imdb_id: { type: String },
	tmdb_id: { type: String },
	imdb_rating:{ type: String }, 
	original_title: { type: String },
	image_path: { type: String },
	userRatingIds:[{ type: mongoose.Types.ObjectId, ref: 'userrating' }],
	watchCount:{ type: Number},
	watchlistCount:{ type: Number },
	likeCount:{ type: Number },
	isActive: { type: Boolean, default: true },
	isDeleted: { type: Boolean, default: false },  

}); 

module.exports = mongoose.model('movie', MoviesSchema);
 