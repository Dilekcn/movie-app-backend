const mongoose = require("mongoose");
const CommentsModel = require("../model/Comment.model")

exports.getAll = async (req, res) => {
  try {
    const response = await CommentsModel.find()
    .populate({ path: 'userId', select: 'firstname lastname' })
    // .populate('userId','firstname')
    
    res.json(response)
  } catch (error) { 
    res.status(500).json(error)
  } 
} 


exports.create = async (req,res) => {
  const newComment = await new CommentsModel({
  userId:req.body.userId,
  videoId:req.body.videoId,
  title: req.body.title,
  content: req.body.content,
  isActive: req.body.isActive,
  isDeleted: req.body.isDeleted,

})
newComment.save().then(response => res.json(response)).catch(err => res.json(err)) 
}

exports.getSingleComment = async (req,res) => {
await CommentsModel.findById({_id: req.params.id}, (err,data) => {
  if(err) {
    res.json({message: err})
  } else {
    res.json(data)
  }
})
}
 
exports.getCommentsByUserId= async (req,res) => {
    await CommentsModel.find({userId: req.params.userId}, (err,data) => {
      if(err) {
        res.json({message: err})
      } else {
        res.json(data)
      }
    }) 
}


exports.getCommentsByVideoId= async (req,res) => {
    await CommentsModel.find({videoId: req.params.userId}, (err,data) => {
      if(err) {
        res.json({message: err})
      } else {
        res.json(data)
      }
    })
}


exports.updateComment = async (req,res) => {       
  await CommentsModel.findByIdAndUpdate({_id: req.params.id},{$set: req.body}).then(data => res.json(data))
        .catch(err => res.json({message: err}))
}

exports.removeSingleComment = async (req,res) => {
   await CommentsModel.findByIdAndDelete({_id: req.params.id}).then(data => res.json(data))
   .catch(err => res.json({message: err}))
}  