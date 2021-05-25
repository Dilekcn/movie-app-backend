const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
	{
        userId:Schema.Types.ObjectId,
		isRead: { type: Boolean, default: false },
		mediaId: Schema.Types.ObjectId,
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

module.exports = mongoose.model('notification', notificationSchema);