const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		firstname: { type: String },
		lastname: { type: String },
		email: { type: String, unique: true }, 
		password: { type: String },
		country: { type: String },
		mediaId: { type: mongoose.Types.ObjectId, ref: 'media' },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		role: { type: String, default: 'user' },
		alt:String
	},
	{ timestamps: true }
);

module.exports = mongoose.model('user', UserSchema);
