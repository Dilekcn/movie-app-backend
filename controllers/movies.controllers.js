const MoviesModel = require('../model/Movies.model');
const MediaModel = require('../model/Media.model');
const WebsiteModel = require('../model/Website.model');
require('dotenv').config();
const S3 = require('../config/aws.s3.config');

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;

		const response = await MoviesModel.find() 
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
		const total = await MoviesModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	const newMovie = await new MoviesModel({
		type: req.body.type,
		imdb_id: req.body.imdb_id,
		original_title: req.body.original_title,
		isActive: req.body.isActive,
		isDeleted: req.body.isDeleted,
	});

	newMovie
		.save()
		.then((data) =>
			res.json({
				status: true,
				message: 'Added new movie successfully',
				data,
			})
		)
		.catch((err) => res.json({ status: false, message: err }));
};

exports.getSingleMovie = async (req, res) => {
	await MoviesModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	})
};



exports.updateSingleMovie = async (req, res) => {
	await MoviesModel.findByIdAndUpdate({ _id: req.params.faqid }, { $set: req.body })
		.then((data) => res.json({ message: 'Successfully updated', data }))
		.catch((err) => res.json({ message: err }));
};
exports.removeSingleMovie = async (req, res) => {
	await MoviesModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
