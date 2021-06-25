const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema(
	{
		userId: { type: mongoose.Types.ObjectId, ref: 'user' },
		title: { type: String, required: true },
		content: { type: String, required: true },
		listId: { type: mongoose.Types.ObjectId, ref: 'list' },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('comment', CommentsSchema);
