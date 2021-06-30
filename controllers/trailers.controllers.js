const TrailersModel = require('../model/Trailer.model');
const mediaModel = require('../model/Media.model');
require('dotenv').config();
const S3 = require('../config/aws.s3.config');
const MediaModel = require('../model/Media.model');

exports.getAll = async (req, res) => {
	try {
		const response = await TrailersModel.find()
			.sort({ createdAt: -1 })
			.populate('mediaId', 'url')
			.populate('bannerId', 'url');
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	const dataMedia = async (data1) => {
		const newMediaId = await new mediaModel({
			url: data1.Location || null,
			title: 'trailer-image',
			mediaKey: data1.Key,
		});
		newMediaId.save(newMediaId);

		const dataBanner = async (data2) => {
			const newBannerId = await new mediaModel({
				url: data2.Location || null,
				title: 'trailer-banner',
				mediaKey: data2.Key,
			});

			newBannerId.save(newBannerId);
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
				tags,
				trailerUrl,
				likes,
			} = req.body;

			const newTrailer = await new TrailersModel({
				title,
				episodeTitle,
				type,
				year,
				duration,
				mediaId: newMediaId._id,
				bannerId: newBannerId._id,
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
				isActive,
				isDeleted,
				imdb,
			});
			newTrailer
				.save()
				.then((response) => res.json(response))
				.catch((err) => res.json(err));
		};

		S3.uploadNewBanner(req, res, dataBanner);
	};

	S3.uploadNewMedia(req, res, dataMedia);
};

exports.getSingleTrailer = async (req, res) => {
	await TrailersModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	})
		.populate('mediaId', 'url')
		.populate('bannerId', 'url');
};

exports.getTrailersByUserId = async (req, res) => {
	await TrailersModel.find({ userId: req.params.userId }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	})
		.populate('mediaId', 'url')
		.populate('bannerId', 'url');
};

exports.getTrailersByVideoId = async (req, res) => {
	await TrailersModel.find({ videoId: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
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
								title: 'trailer-image',
								mediaKey: data.Key,
							},
						},
						{ useFindAndModify: false, new: true }
					).catch((err) => res.json({ message: err, status: false }));
				};
				await S3.updateMedia(req, res, media.mediaKey, data);
			});

			await MediaModel.findById({ _id: trailer.bannerId }).then(async (banner) => {
				console.log(banner);
				const data = async (data) => {
					await MediaModel.findByIdAndUpdate(
						{ _id: trailer.bannerId },
						{
							$set: {
								url: data.Location || null,
								title: 'trailer-banner',
								mediaKey: data.Key,
							},
						},
						{ useFindAndModify: false, new: true }
					).catch((err) => res.json({ message: err, status: false }));
				};
				await S3.updateBanner(req, res, banner.mediaKey, data);
			});
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
				tags,
				trailerUrl,
				likes,
			} = req.body;

			await TrailersModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: {
						title,
						episodeTitle,
						type,
						year,
						duration,
						mediaId: trailer.mediaId,
						bannerId: trailer.bannerId,
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
						isActive,
						isDeleted,
						imdb,
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
				.catch((err) => res.json({ message: err }));
		})
		.catch((err) => res.json({ message: err }));
};

exports.removeSingleTrailer = async (req, res) => {
	await TrailersModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
