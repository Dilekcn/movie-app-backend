const MoviesModel = require('../model/Movies.model');
const MediaModel = require('../model/Media.model');
const WebsiteModel = require('../model/Website.model');
const UserRatingModel = require('../model/UserRatings.model');
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
		tmdb_id:req.body.tmdb_id,
		imdb_rating:req.body.imdb_rating,
		original_title: req.body.original_title,
		isActive: req.body.isActive,
		isDeleted: req.body.isDeleted,
		userRatingIds:req.body.userRatingIds, 
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
	await MoviesModel.findById({ _id: req.params.id })
		.then(async (movie) => {

			const newUserRating = 
				typeof req.body.userRatingIds === 'string'
					? await JSON.parse(req.body.userRatingIds).map(
							(userrating) => {
								return new UserRatingModel({
									userId: userrating.userId,
									movieId: req.params.id, 
									rating: userrating.rating,
								});
							}
					  )
					: req.body.UserRatingModel.map((userrating) => {
							return new UserRatingModel({
								userId: userrating.userId,
								movieId: req.params.id,
								rating: userrating.rating,
							});
					  });
 
			newUserRating.map((userrating) => userrating.save());

			const newUserRatingIds = newUserRating.map((userrating) => userrating._id);

			const {type,imdb_id,tmdb_id,imdb_rating,original_title} =
				req.body;
			const newmovieids= typeof req.body.movieIds === 'string' ? JSON.parse(req.body.movieIds): req.body.movieIds
			await MoviesModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: { 
						type,
						imdb_id,
						tmdb_id,
						imdb_rating,
						original_title,
						userRatingIds:newUserRatingIds,
						isActive: !req.body.isActive
							? true
							: req.body.isActive,
						isDeleted: !req.body.isDeleted
							? false
							: req.body.isDeleted,
					},
				},
				{ useFindAndModify: false, new: true }
			)
				.then((data) =>
					res.json({
						status: 200,
						message: 'Movie is updated successfully',
						data,
					})
				)
				.catch((err) => ({ status: 400, message: err })); 
		})
		.catch((err) => ({ status: 400, message: err }));

		await MoviesModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err })); 
};















exports.removeSingleMovie = async (req, res) => {
	await MoviesModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err })); 
};
