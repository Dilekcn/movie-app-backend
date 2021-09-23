const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const ListLikesSchema = new Schema(
	{ 
		userId: { type: Schema.Types.ObjectId, ref: 'user'},
		listId: { type: Schema.Types.ObjectId, ref: 'list' },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false }, 
	},
	{ timestamps: true }  
);     

module.exports = mongoose.model('listlike', ListLikesSchema);        