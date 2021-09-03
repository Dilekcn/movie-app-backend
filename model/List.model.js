const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const ListsSchema = new Schema(
	{
		userId: { type: mongoose.Types.ObjectId, ref: 'user' },
		likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
		commentIds: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
		name: { type: String, required: true },
		description: { type: String, required: true },
		rating:{ type: Number, default: 0 }, 
		tags: { type: Array },
		movieIds:[{ type: mongoose.Types.ObjectId, ref: 'movie' }],
		isPublic: { type: Boolean, default: true },
		isActive: { type: Boolean, default: false }, 
		isDeleted: { type: Boolean, default: false },  
	},  
	{ timestamps: true }
); 

module.exports = mongoose.model('list', ListsSchema); 
  