const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MovieSchema = new Schema({
    name: {type:String, required:true},
    originalName: {type:String, required:true},
    director: {type: String, required:true},
    writer:{type:String, required:true},
    type:{type:String, required:true},
    year:{type:Number, required:true},
    duration:{type:String, required:true},
    rating:{type:Number, required:true},
    imageId:{type: mongoose.Types.ObjectId, required:true},
    userId: {type: mongoose.Types.ObjectId, required:true},
    starring:{type:Array}, 
    novel:{type:String},
    summary:{type:String, required:true},
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