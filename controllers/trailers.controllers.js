const mongoose = require("mongoose");
const TrailersModel = require('../model/Trailer.model')

exports.getAll = async (req, res) => {
    try {
        const response = await TrailersModel.find()
        res.json(response)
    } catch (e) {
        res.status(500).json(e)
    } 
}
 

exports.create =  (req, res) => {
    const {title,type,year,duration,mediaId,cast,description,genre,ageRestriction,totalSeasons,seasonNumber,episodeNumber,tags,trailerUrl}=req.body
	const newTrailer = new TrailersModel({
        title,
        type,
        year,
        duration, 
        mediaId,
        cast,
        description,
        genre,
        ageRestriction,
        totalSeasons,
        seasonNumber,
        episodeNumber,
        tags,
        trailerUrl 
	}); 
	newTrailer
		.save()
		.then((response) => res.json(response))
		.catch((err) => res.json(err));
};

exports.getSingleTrailer = async (req, res) => {
   await TrailersModel.findById({_id: req.params.id}, (err, data) => {
       if(err) {
        res.json({message: err})
       } else {
           res.json(data)
       }
   })
}


exports.getSingleTrailerByTitle = async (req, res) => {
    await TrailersModel.findOne({title: req.params.title}, (err, data) => {
        if(err) {
         res.json({message: err})
        } else {
            res.json(data)
        }
    })
 }


 exports.updateSingleTrailer = async (req, res) => {
     await TrailersModel.findByIdAndUpdate({_id: req.params.id}, {$set: req.body})
     .then(data => res.json(data))
     .catch(err => res.json({message: err}))
 }


 exports.removeSingleTrailer = async (req, res) => {
     await TrailersModel.findByIdAndDelete({_id: req.params.id})
     .then(data => res.json(data))
     .catch(err => res.json({message: err}))
 }
