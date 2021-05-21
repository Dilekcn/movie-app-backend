const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactInfoSchema = new Schema({
	address: { type: String, required: true },
	phone: { type: String, required: true },
	email: { type: String, required: true },
	socialmedia: { type: Array, required: true },
});

module.exports = mongoose.model('contactinfo', ContactInfoSchema);
