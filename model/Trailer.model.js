const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrailersSchema = new Schema(
	{ 
		title: {type:String},
		type:{type:String},
		episodeTitle:{type:String},
		year:{type:Number},
		duration:{type:String},
		mediaId:{type: mongoose.Types.ObjectId,ref:'media'},
		bannerId:{type: mongoose.Types.ObjectId,ref:'media'},
		cast:{type:Array}, 
		description:{type:String},
		genre:{type:Array},
		ageRestriction:{type:Number},  
		totalSeasons:{type:Number},
		seasonNumber:{type:Number}, 
		episodeNumber:{type:Number},
		tags:{type:Array},
		trailerUrl:{type:String},
		likes:{type:Number}
	},
	{ timestamps: true },
);
 
module.exports = mongoose.model('trailer', TrailersSchema);
