const TrailersModel = require('../model/Trailer.model');
const MediaModel = require('../model/Media.model');
const WebsiteModel = require('../model/Website.model');
require('dotenv').config();
const S3 = require('../config/aws.s3.config');

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;

		const response = await TrailersModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('mediaId', 'url title alt')
			.populate('genre', 'name');
		const total = await TrailersModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
		const dataMedia = async (data1) => {
			const newMediaId = await new MediaModel({
				url: data1.Location || null,
				title: 'trailer-image',
				mediaKey: data1.Key,
				alt: req.body.title || null,
			});
			newMediaId.save(newMediaId);
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
					tags,
					trailerUrl,
					websiteId
				} = req.body;

				const newTrailer = await new TrailersModel({
					title,
					episodeTitle,
					type,
					year,
					duration,
					mediaId: newMediaId._id,
					cast: cast.split(','),
					description,
					genre: typeof genre === 'string' ? JSON.parse(genre) : genre,
					ageRestriction,
					totalSeasons,
					seasonNumber,
					episodeNumber,
					director,
					tags: tags.split(','),
					trailerUrl,
					isActive,
					isDeleted,
					imdb,
					websiteId:typeof websiteId === 'string' ? JSON.parse(websiteId) : websiteId
				});

				newTrailer
					.save()
					.then((response) => {
						res.json(response);
					})
					.catch((err) => res.json(err));
		};

		S3.uploadNewMedia(req, res, dataMedia);
	}
// };

exports.getSingleTrailer = async (req, res) => {
	await TrailersModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	})
		.populate('mediaId', 'url title alt')
		.populate('genre', 'name');
};

exports.getTrailersByUserId = async (req, res) => {
	await TrailersModel.find({ userId: req.params.userId }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	})
		.populate('mediaId', 'url title alt')
};

exports.updateSingleTrailer = async (req, res) => {
	await TrailersModel.findById({ _id: req.params.id })
		.then(async (trailer) => {
			await MediaModel.findById({ _id: trailer.mediaId }).then(async (media) => {
				const data = async (data) => {
					await MediaModel.findByIdAndUpdate(
						{ _id: trailer.mediaId },
						{
							$set: {
								url: data.Location || null,
								title: 'trailers',
								mediaKey: data.Key,
								alt: req.body.alt || null,
							},
						},
						{ useFindAndModify: false, new: true }
					).catch((err) => res.json({ status: 404, message: err }));
				};
				await S3.updateMedia(req, res, media.mediaKey, data);
			});
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
						genre: typeof genre === 'string' ? JSON.parse(genre) : genre,
						ageRestriction: ageRestriction ? ageRestriction : trailer.ageRestriction,
						totalSeasons: totalSeasons ? totalSeasons : trailer.totalSeasons,
						seasonNumber: seasonNumber ? seasonNumber : trailer.seasonNumber,
						episodeNumber: episodeNumber ? episodeNumber : trailer.episodeNumber,
						director: director ? director : trailer.director,
						tags: tags ? tags : trailer.tags,
						trailerUrl: trailerUrl ? trailerUrl : trailer.trailerUrl,
						websiteId:websiteId  ? JSON.parse(websiteId) : trailer.websiteId,
						isActive: !req.body.isActive ? true : req.body.isActive,
						isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
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
};

exports.removeSingleTrailer = async (req, res) => {
	await TrailersModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
