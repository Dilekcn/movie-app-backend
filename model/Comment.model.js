const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema(
	{
		userId: {type: mongoose.Types.ObjectId, ref:'users'},
		videoId: {type: mongoose.Types.ObjectId, ref:'videos'},
		title: { type: String, required: true },
		content: { type: String, required: true },
        isActive:{ type: Boolean, default: true },
        isDeleted:{ type: Boolean, default: false } 
	},
	{ timestamps: true },
);
 
module.exports = mongoose.model('comment', CommentsSchema);
 