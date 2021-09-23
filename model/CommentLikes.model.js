const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const commentLikesSchema = new Schema(
	{ 
		userId: { type: Schema.Types.ObjectId, ref: 'user'},
		commentId: { type: Schema.Types.ObjectId, ref: 'comment' },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false }, 
	},
	{ timestamps: true }  
);      

module.exports = mongoose.model('commentlike', commentLikesSchema);         