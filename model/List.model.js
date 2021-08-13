const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const ListsSchema = new Schema(
	{
		userId: { type: mongoose.Types.ObjectId, ref: 'user' },
		name: { type: String, required: true },
		description: { type: String, required: true },
		rating:{ type: Number, default: 0 },
		mediaId:{ type: mongoose.Types.ObjectId, ref: 'media' },
		userRating:[{ type: mongoose.Types.ObjectId, ref: 'user' }],
		movieIds:[{ type: mongoose.Types.ObjectId, ref: 'movies' }],
		isPublic: { type: Boolean, default: true },
		isActive: { type: Boolean, default: false },
		isDeleted: { type: Boolean, default: false },
	}, 
	{ timestamps: true }
);

module.exports = mongoose.model('list', ListsSchema);
 