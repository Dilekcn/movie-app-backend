const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WatchListSchema = new Schema(
	{ 
		userId: { type: Schema.Types.ObjectId, ref: 'user'},
		movieId: { type: Schema.Types.ObjectId, ref: 'movie' },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false }, 
	},
	{ timestamps: true }  
);    

module.exports = mongoose.model('watchlist', WatchListSchema);      