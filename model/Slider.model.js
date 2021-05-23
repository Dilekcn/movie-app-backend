const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sliderSchema = new Schema(
	{
        videoId:Schema.Types.ObjectId,
        isActive:{ type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

module.exports = mongoose.model('slider', sliderSchema);