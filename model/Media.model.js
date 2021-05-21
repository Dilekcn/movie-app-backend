const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MediaSchema = new Schema({ 
    url: {type:String, required: true},
    title:{type:String, required: true},
    description:{type:String, required: true},
    isActive:{type:Boolean, default:true},
    isDeleted:{type:Boolean, default:false},
}, {timestamps: true})


module.exports = mongoose.model('media', MediaSchema)