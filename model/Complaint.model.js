const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComplaintSchema = new Schema(
	{
		title: { type: String },
	    reason:{type:String},
        commentId: { type: mongoose.Types.ObjectId, ref: 'comment' },
        userId: { type: mongoose.Types.ObjectId, ref: 'user' },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Complaint', ComplaintSchema);