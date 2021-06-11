const MoviesModel = require('../model/Movie.model')

exports.getAll = async (req, res) => {
    try {
        const response = await MoviesModel.find()
        res.json(response)
    } catch (e) {
        res.status(500).json(e)
    }
} 

exports.create = async (req, res) => {

    if(req.files.images) {
        const file = req.files.images
        const filename = file.name
        
        file.mv('./uploads/' + filename, err => {
          if(err) {
            res.send(err)
          } else {
            const newMovie =  new MoviesModel({
                name: req.body.name,
                originalName: req.body.originalName,
                director: req.body.director,
                writer: req.body.writer,
                type: req.body.type,
                year: req.body.year,
                duration: req.body.duration,
                rate: req.body.rate,
                imageId: req.body.imageId,
                userId: req.body.userId,
                cast: req.body.cast,
                novel:req.body.novel,
                summary:req.body.summary,
                genre:req.body.genre,
                ageRestriction:req.body.ageRestriction,
                seasonCount:req.body.seasonCount,
                episodeCount:req.body.episodeCount,
                likes:req.body.likes,
                imdb:req.body.imdb,
                tags:req.body.tags,
                trailerUrl:req.body.trailerUrl
            })
        
            newMovie.save().then(response => res.json({message:'Movie Created', status:true, response})).catch(err => res.json({message:err, status:false}))
          }
        })
      } else {
        const newMovie = new MoviesModel({
            name: req.body.name,
            director: req.body.director,
            writer: req.body.writer,
            type: req.body.type,
            year: req.body.year,
            duration: req.body.duration,
            rate: req.body.rate,
            imageId: req.body.imageId,
            userId: req.body.userId,
            originalName: req.body.originalName,
            cast: req.body.cast,
            novel:req.body.novel,
            summary:req.body.summary,
            genre:req.body.genre,
            ageRestriction:req.body.ageRestriction,
            seasonCount:req.body.seasonCount,
            episodeCount:req.body.episodeCount,
            likes:req.body.likes,
            imdb:req.body.imdb,
            tags:req.body.tags,
            trailerUrl:req.body.trailerUrl
        })
    
        newMovie.save().then(response => res.json({message:'Movie Created', status:true, response})).catch(err => res.json({message:err, status:false}))
      }

  
}

exports.getSingleMovie = async (req, res) => {
   await MoviesModel.findById({_id: req.params.movieid}, (err, data) => {
       if(err) {
        res.json({message: err})
       } else {
           res.json(data)
       }
   })
}


exports.getSingleMovieByName = async (req, res) => {
    await MoviesModel.findOne({name: req.params.name}, (err, data) => {
        if(err) {
         res.json({message: err})
        } else {
            res.json(data)
        }
    })
 }


 exports.updateSingleMovie = async (req, res) => {
     await MoviesModel.findByIdAndUpdate({_id: req.params.movieid}, {$set: req.body})
     .then(data => res.json(data))
     .catch(err => res.json({message: err}))
 }


 exports.removeSingleMovie = async (req, res) => {
     await MoviesModel.findByIdAndDelete({_id: req.params.movieid})
     .then(data => res.json(data))
     .catch(err => res.json({message: err}))
 }
