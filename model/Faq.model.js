const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FaqSchema = new Schema(
	{
		question: { type: String, required: true },
		answer: { type: String, required: true },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('faq', FaqSchema);
