const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaSchema = new Schema(
	{
		url: { type: String },
		title: { type: String },
		alt: { type: String },
		altImage: { type: String },
		altBanner: { type: String },
		isActive: { type: Boolean, default: true }, 
		isDeleted: { type: Boolean, default: false },
		mediaKey: { type: String },
		type:String
	},

	{ timestamps: true }
);

module.exports = mongoose.model('media', MediaSchema);
