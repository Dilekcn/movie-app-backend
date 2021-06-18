const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MovieSchema = new Schema({
    name: {type:String, required:true},
    originalName: {type:String},
    director: {type: String},
    writer:{type:String},
    type:{type:String},
    year:{type:Number},
    duration:{type:String},
    rating:{type:Number},
    imageUrl:{type:String, default:null},
    userId: {type: mongoose.Types.ObjectId},
    starring:{type:Array},
    novel:{type:String},
    summary:{type:String},
    genre:{type:String},
    ageRestriction:{type:Number},
    seasonCount:{type:Number},
    episodeCount:{type:Number},
    likes:{type:Number},
    imdb:{type:Number},
    tags:{type:String},
    trailerUrl:{type:String}
}, {timestamps:true})

module.exports = mongoose.model('movie', MovieSchema)