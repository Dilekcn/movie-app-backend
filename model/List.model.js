const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListsSchema = new Schema(
	{
		userId: {type: mongoose.Types.ObjectId, ref:'users'},
		name: { type: String, required: true },
		description: { type: String, required: true },
        coverImageId: {type: mongoose.Types.ObjectId, ref:'media'},
        sortBy:{type:[String]},
        isPublic:{ type: Boolean, default: true },
        isActive:{ type: Boolean, default: true },
        isDeleted:{ type: Boolean, default: false } 
	},
	{ timestamps: true },
);
 
module.exports = mongoose.model('list', ListsSchema);