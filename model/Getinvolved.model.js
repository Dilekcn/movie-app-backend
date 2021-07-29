const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GetInvolvedSchema = new Schema(
	{
	
		title: { type: String },
        mediaId: { type: mongoose.Types.ObjectId, ref: 'media' },
        content:String,
        moreInfoLinkText:String,
        moreInfoContent:String,     
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		
	},

	{ timestamps: true }
);

module.exports = mongoose.model('involve', GetInvolvedSchema);