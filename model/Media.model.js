const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MediaSchema = new Schema({ 
    url: {type:String},
    title:{type:String},
    description:{type:String},
    isActive:{type:Boolean, default:true},
    isDeleted:{type:Boolean, default:false},
}, {timestamps: true})
 

module.exports = mongoose.model('media', MediaSchema)