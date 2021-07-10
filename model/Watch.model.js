const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WatchSchema = new Schema(
	{
		title: { type: String },
		link: { type: String },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('watch', WatchSchema);
