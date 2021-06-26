const MediaModel = require('../model/Media.model')
const AWS = require('aws-sdk')
require('dotenv').config()
const Access_Key = 'AKIATHUYFINRAEMY72NM'
const Secret_Key = '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'
const Bucket_Name = 'movieappimageupload'

exports.getAllMedia = async (req, res) => {
    try {
        const response = await MediaModel.find()
        res.json(response)
    } catch (e) {
        res.status(500).json(e)
    }
} 
 
exports.createMedia = async (req, res) => {

    const files = req.files.image
    
    const s3 = new AWS.S3({
        accessKeyId:Access_Key,
        secretAccessKey:Secret_Key
    })

    const params = {
        Bucket:Bucket_Name,
        Key:req.files.image.name,
        Body:req.files.image.data,
        ContentType:'image/JPG'
    }

    s3.upload(params, async (err, data) => {
        if(err) {
            res.json(err)
        } else {
            const newMovie = await new MediaModel({
                url: data.Location,
                title: req.body.title,
                description: req.body.description,
                isHomePage: req.body.isHomePage,
                isActive: req.body.isActive,
                isDeleted: req.body.isDeleted
            })
        
            newMovie.save().then(response => res.json({message:'Media Created', status:true, response})).catch(err => res.json({message:err, status:false}))
        }
    })

}

exports.getSingleMedia = async (req, res) => {
   await MediaModel.findById({_id: req.params.mediaId}, (err, data) => {
       if(err) {
        res.json({message: err, status:false})
       } else {
           res.json(data)
       }
   })
}  


 exports.updateSingleMedia = async (req, res) => {
     await MediaModel.findByIdAndUpdate({_id: req.params.mediaId}, {$set: req.body})
     .then(data => res.json({message:'Media updated', status:true, data}))
     .catch(err => res.json({message: err, status:false}))
 }


 exports.removeSingleMedia = async (req, res) => {
     await MediaModel.findByIdAndDelete({_id: req.params.mediaId})
     .then(data => res.json({message:'Media removed', status:true, data}))
     .catch(err => res.json({message: err, status:false}))
 }
