const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sliderSchema = new Schema(
	{
        videoId:Schema.Types.ObjectId,
		isRead: { type: Boolean, default: false },
		mediaId: Schema.Types.ObjectId,
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

module.exports = mongoose.model('slider', sliderSchema);