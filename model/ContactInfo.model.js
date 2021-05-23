const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactInfoSchema = new Schema(
	{
		address: { type: String, required: true },
		phone: { type: String, required: true },
		email: { type: String, required: true },
		socialMedia: { type: Array, required: true },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		userId: { type: mongoose.Types.ObjectId, ref: 'user' },
	},
	{ timestamps: true },
);

module.exports = mongoose.model('contactinfo', ContactInfoSchema);
