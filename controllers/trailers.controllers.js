const TrailersModel = require('../model/Trailer.model');
const MediaModel = require('../model/Media.model');
require('dotenv').config();
const S3 = require('../config/aws.s3.config');

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;

		const response = await TrailersModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
		const total = await TrailersModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	if(req.files) {
		const data = async(data) => {
			const newMedia = new MediaModel({
				url: data.Location || null,
				title: 'trailers',
				mediaKey: data.Key,
				alt: 'trailers',
			})  
  
			newMedia.save() 
  
			const {
				imdb,
				isActive,
				isDeleted,
				title,
				episodeTitle,
				type,
				year,
				duration,
				cast,
				description,
				genre,
				ageRestriction,
				totalSeasons,
				seasonNumber,
				episodeNumber, 
				director,
				trailerUrl,
				mediaUrl
			} = req.body;
	
			const newTrailer = await new TrailersModel({
				title,
				episodeTitle, 
				type,
				year,
				duration,
				mediaUrl:newMedia.url,
				cast:typeof cast === 'string' ? JSON.parse(cast) : cast,
				description,
				genre: typeof genre === 'string' ? JSON.parse(genre) : genre, 
				ageRestriction,
				totalSeasons,
				seasonNumber,
				episodeNumber,
				director,
				trailerUrl,
				isActive, 
				isDeleted, 
				imdb,
		
			});
	
			newTrailer
				.save()
				.then((response) => { 
					res.json(response);
				})
				.catch((err) => res.json(err));
			
		}
		await S3.uploadNewMediaForTrailer(req, res, data)
	} else {
		const {
			imdb,
			isActive,
			isDeleted,
			title,
			episodeTitle,
			type,
			year,
			duration,
			cast,
			description,
			genre,
			ageRestriction,
			totalSeasons,
			seasonNumber,
			episodeNumber, 
			director,
			trailerUrl,
			mediaUrl
		} = req.body;

		const newTrailer = await new TrailersModel({
			title,
			episodeTitle,
			type,
			year,
			duration,
			mediaUrl,
			cast:typeof cast === 'string' ? JSON.parse(cast) : cast,
			description,
			genre: typeof genre === 'string' ? JSON.parse(genre) : genre,
			ageRestriction,
			totalSeasons,
			seasonNumber,
			episodeNumber,
			director,
			trailerUrl,
			isActive,
			isDeleted,
			imdb,
	
		});

		newTrailer
			.save()
			.then((response) => {
				res.json(response);
			})
			.catch((err) => res.json(err));
	}
}


exports.getSingleTrailer = async (req, res) => {
	await TrailersModel.findOne({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err }); 
		} else {
			res.json(data);
		}   
	}) 
};  



exports.updateSingleTrailer = async (req, res) => {
	if(req.files) {
		await TrailersModel.findById({ _id: req.params.id })
		.then(async (trailer) => {
			const data = async(data) => {
				const newMedia = await new MediaModel({
					url: data.Location || null,
					title: 'trailers',
					mediaKey: data.Key,
					alt: 'trailers',
				});
		
				newMedia.save();
				const {
					title,
					type,
					year,
					duration, 
					mediaId,
					cast,
					description,
					genre,
					ageRestriction,
					tags,
					trailerUrl,
					totalSeasons,
					seasonNumber,
					episodeNumber,
					episodeTitle,
					director, 
					imdb,
					websiteId
				} = req.body;
	
				await TrailersModel.findByIdAndUpdate(
					{ _id: req.params.id },
					{
						$set: {
							title: title ? title : trailer.title, 
							episodeTitle: episodeTitle ? episodeTitle : trailer.episodeTitle,
							type: type ? type : trailer.type, 
							year: year ? year : trailer.year,
							duration: duration ? duration : trailer.duration,
							mediaId: trailer.mediaId, 
							cast: cast ? cast : trailer.cast,
							description: description ? description : trailer.description,
							genre: genre ? (typeof genre === 'string' ? JSON.parse(genre) : genre) : trailer.genre,
							ageRestriction: ageRestriction ? ageRestriction : trailer.ageRestriction,
							totalSeasons: totalSeasons ? totalSeasons : trailer.totalSeasons,
							seasonNumber: seasonNumber ? seasonNumber : trailer.seasonNumber,
							episodeNumber: episodeNumber ? episodeNumber : trailer.episodeNumber,
							director: director ? director : trailer.director,
							tags: tags ? tags : trailer.tags,
							trailerUrl: newMedia ? newMedia.url : trailer.trailerUrl,
							websiteId:websiteId  ? JSON.parse(websiteId) : trailer.websiteId,
							isActive: !req.body.isActive ? trailer.isActive : req.body.isActive,
							isDeleted: !req.body.isDeleted ? trailer.isDeleted : req.body.isDeleted,
							imdb: imdb ? imdb : trailer.imdb,
	
						},
					}
				)
					.then((data) =>
						res.json({
							status: true,
							message: 'Trailer is updated successfully',
							data,
						})
					)
	
					.catch((err) => res.json({ message: err, status: 404 }));
			}
			await S3.uploadNewMedia(req, res, data)
		})
		.catch((err) => res.json({ message: err, status: 404 }));
	} else {
		await TrailersModel.findById({ _id: req.params.id })
		.then(async (trailer) => {
			const {
                title,
				type,
				year,
				duration, 
				mediaId,
				cast,
				description,
				genre,
				ageRestriction,
				tags,
				trailerUrl,
				totalSeasons,
				seasonNumber,
				episodeNumber,
				episodeTitle,
				director, 
				imdb,
				websiteId
			} = req.body;

			await TrailersModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: {
						title: title ? title : trailer.title, 
						episodeTitle: episodeTitle ? episodeTitle : trailer.episodeTitle,
						type: type ? type : trailer.type, 
						year: year ? year : trailer.year,
						duration: duration ? duration : trailer.duration,
						mediaId: trailer.mediaId, 
						cast: cast ? cast : trailer.cast,
						description: description ? description : trailer.description,
						genre: genre ? (typeof genre === 'string' ? JSON.parse(genre) : genre) : trailer.genre,
						ageRestriction: ageRestriction ? ageRestriction : trailer.ageRestriction,
						totalSeasons: totalSeasons ? totalSeasons : trailer.totalSeasons,
						seasonNumber: seasonNumber ? seasonNumber : trailer.seasonNumber,
						episodeNumber: episodeNumber ? episodeNumber : trailer.episodeNumber,
						director: director ? director : trailer.director,
						tags: tags ? tags : trailer.tags,
						trailerUrl: trailerUrl ? trailerUrl : trailer.trailerUrl,
						websiteId:websiteId  ? JSON.parse(websiteId) : trailer.websiteId,
						isActive: !req.body.isActive ? trailer.isActive : req.body.isActive,
						isDeleted: !req.body.isDeleted ? trailer.isDeleted : req.body.isDeleted,
						imdb: imdb ? imdb : trailer.imdb,

					},
				}
			)
				.then((data) =>
					res.json({
						status: true,
						message: 'Trailer is updated successfully',
						data,
					})
				)

				.catch((err) => res.json({ message: err, status: 404 }));
		})
		.catch((err) => res.json({ message: err, status: 404 }));
	}
};
exports.searchWithTitle = async (req, res, next) => {
	const total = await TrailersModel.find({ "title": { "$regex": req.body.title, "$options": "i" } }).countDocuments();
	try {
		const response = await TrailersModel.find({ "title": { "$regex": req.body.title, "$options": "i" } })
		res.json({status:200,total,message: 'Filtered trailers', response }); 
	} catch (error) {
		next({ status: 404, message: error });
	}  
}; 

exports.removeSingleTrailer = async (req, res) => {
	await TrailersModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
