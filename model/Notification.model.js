const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'user' },
		title:String,
		qoute:String,
		isRead: { type: Boolean, default: false },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true } 
);

module.exports = mongoose.model('notification', notificationSchema);
