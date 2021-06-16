const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TrailerSchema = new Schema({
    title: {type:String, required:true},
    type:{type:String, required:true},
    year:{type:Number, required:true},
    duration:{type:String},
    mediaId:{type: mongoose.Types.ObjectId, required:true},
    cast:{type:Array},
    description:{type:String, required:true},
    genre:{type:Array},
    ageRestriction:{type:Number},
    totalSeasons:{type:Number},
    seasonNumber:{type:Number},
    episodeNumber:{type:Number},
    tags:{type:Array},
    trailerUrl:{type:String}
}, {timestamps:true})

module.exports = mongoose.model('trailer', TrailerSchema)