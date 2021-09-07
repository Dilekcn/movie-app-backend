const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const ListsSchema = new Schema(
	{
		userId: { type: mongoose.Types.ObjectId, ref: 'user',required:true },
		likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
		name: { type: String, required: true },
		description: { type: String, required: true },
		rating:{ type: Number, default: 0 },  
		tags: { type: Array },
		movieIds:[{ type: mongoose.Types.ObjectId, ref: 'movie',required:true }],
		isPublic: { type: Boolean, default: true },
		isActive: { type: Boolean, default: false }, 
		isDeleted: { type: Boolean, default: false },  
	},  
	{ timestamps: true }
); 

module.exports = mongoose.model('list', ListsSchema); 
   