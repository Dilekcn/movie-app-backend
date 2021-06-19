const mongoose = require("mongoose");
const TrailersModel = require("../model/Trailer.model")

exports.getAll = async (req, res) => {
  try {
    const response = await TrailersModel.find()
    .populate('mediaId','url')
    .populate('bannerId','url')
    res.json(response)
  } catch (error) {
    res.status(500).json(error)
  } 
}  

 
exports.create = async (req,res) => {
  const {title,episodeTitle,type,year,duration,mediaId,bannerId,cast,description,genre,ageRestriction,totalSeasons,seasonNumber,episodeNumber,tags,trailerUrl,likes}=req.body
	const newTrailer = new TrailersModel({
        title,
        episodeTitle,
        type,
        year,
        duration, 
        mediaId,
        bannerId,
        cast,
        description,
        genre,
        ageRestriction,
        totalSeasons,
        seasonNumber,
        episodeNumber,
        tags,
        trailerUrl,
        likes,
	}); 
	newTrailer
		.save()
		.then((response) => res.json(response))
		.catch((err) => res.json(err));
}

exports.getSingleTrailer = async (req,res) => {
await TrailersModel.findById({_id: req.params.id}, (err,data) => {
  if(err) {
    res.json({message: err})
  } else {
    res.json(data)
  }
})
}
 
exports.getTrailersByUserId= async (req,res) => {
    await TrailersModel.find({userId: req.params.userId}, (err,data) => {
      if(err) {
        res.json({message: err})
      } else {
        res.json(data)
      }
    }) 
}


exports.getTrailersByVideoId= async (req,res) => {
    await TrailersModel.find({videoId: req.params.id}, (err,data) => {
      if(err) {
        res.json({message: err})
      } else {
        res.json(data)
      }
    })
}


exports.updateSingleTrailer = async (req,res) => {       
  await TrailersModel.findByIdAndUpdate({_id: req.params.id},{$set: req.body}).then(data => res.json(data))
        .catch(err => res.json({message: err}))
}

exports.removeSingleTrailer = async (req,res) => {
   await TrailersModel.findByIdAndDelete({_id: req.params.id}).then(data => res.json(data))
   .catch(err => res.json({message: err}))
}  