const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		firstname: { type: String,required:true },
		lastname: { type: String,required:true },
		email: { type: String, unique: true,required:true }, 
		password: { type: String,required:true },
		country: { type: String },
		mediaId: { type: mongoose.Types.ObjectId, ref: 'media' },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false }, 
		role: { type: String, default: 'user' },
		backgroundImageId: { type: mongoose.Types.ObjectId, ref: 'media' },
		alt:String
	},
	{ timestamps: true } 
);  

module.exports = mongoose.model('user', UserSchema);
  