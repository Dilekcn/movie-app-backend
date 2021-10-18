const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const ListsSchema = new Schema(
	{
		userId: { type: mongoose.Types.ObjectId, ref: 'user'},
		likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
		name: { type: String},
		description: { type: String},
		reasonToBlock: { type: String},
		rating:{ type: Number},  
		tags: { type: Array },
		movieIds:[{ type: mongoose.Types.ObjectId, ref: 'movie'}],
		isPublic: { type: Boolean, default: true },
		isActive: { type: Boolean, default: false }, 
		isDeleted: { type: Boolean, default: false },  
	},  
	{ timestamps: true }  
); 

module.exports = mongoose.model('list', ListsSchema); 
    