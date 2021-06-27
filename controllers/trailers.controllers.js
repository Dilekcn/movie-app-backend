const TrailersModel = require('../model/Trailer.model');
const mediaModel = require('../model/Media.model');
const AWS = require('aws-sdk');
require('dotenv').config();
const Access_Key = process.env.Access_Key_ID;
const Secret_Key = process.env.Secret_Access_Key;
const Bucket_Name = process.env.Bucket_Name;

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
	const mediaId = req.files.mediaId;
	const bannerId = req.files.bannerId;

	const s3 = new AWS.S3({
		accessKeyId: Access_Key,
		secretAccessKey: Secret_Key,
	});

	const params1 = {
		Bucket: Bucket_Name,
		Key: mediaId.name,
		Body: mediaId.data,
		ContentType: 'image/JPG',
	};

	const params2 = {
		Bucket: Bucket_Name,
		Key: bannerId.name,
		Body: bannerId.data,
		ContentType: 'image/JPG',
	};

	await s3.upload(params1, async (err, data1) => {
		if (err) {
			res.json(err);
		} else {
			await s3.upload(params2, async (err, data2) => {
				if (err) {
					res.json(err);
				} else {
					const newMediaId = await new mediaModel({
						url: data1.Location || null,
						title: req.body.title || null,
						description: req.body.description || null,
					});
					newMediaId.save(newMediaId);
					const newBannerId = await new mediaModel({
						url: data2.Location || null,
						title: req.body.title || null,
						description: req.body.description || null,
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
					const newTrailer = new TrailersModel({
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
				}
			});
		}
	});
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
	await TrailersModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};

exports.removeSingleTrailer = async (req, res) => {
	await TrailersModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
