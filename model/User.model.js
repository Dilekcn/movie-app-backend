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
		watchlist: [{ type: mongoose.Types.ObjectId, ref: 'movie' }],
		watched: [{ type: mongoose.Types.ObjectId, ref: 'movie' }],
		liked: [{ type: mongoose.Types.ObjectId, ref: 'movie' }],
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false }, 
		role: { type: String, default: 'user' },
		alt:String
	},
	{ timestamps: true }
); 

module.exports = mongoose.model('user', UserSchema);
