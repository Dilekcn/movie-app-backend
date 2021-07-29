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
			.populate('mediaId', 'url title alt')
			.populate('bannerId', 'url title alt')
			.populate('websiteId', 'title link')
			.populate('genre', 'name');
		const total = await MoviesModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	if (req.body.websiteId) {
		const newWebsite = await JSON.parse(req.body.websiteId).map((web) => {
			const website = web;
			return new WebsiteModel({
				title: website.title || null,
				link: website.link || null,
			});
		});
		newWebsite.map((web) => web.save());
		const websiteIds = newWebsite.map((web) => web._id);

		const dataMedia = async (data1) => {
			const newMediaId = await new MediaModel({
				url: data1.Location || null,
				title: 'movie-image',
				mediaKey: data1.Key,
				alt: req.body.title || null,
			});
			newMediaId.save(newMediaId);

			const dataBanner = async (data2) => {
				const newBannerId = await new MediaModel({
					url: data2.Location || null,
					title: 'movie-banner',
					mediaKey: data2.Key,
					alt: req.body.title || null,
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
					director,
					tags,
					likes,
				} = req.body;

				const newMovie = await new MoviesModel({
					title,
					episodeTitle,
					type,
					year,
					duration,
					mediaId: newMediaId._id,
					bannerId: newBannerId._id,
					cast: cast.split(','),
					description,
					genre: typeof genre === 'string' ? JSON.parse(genre) : genre,
					ageRestriction,
					totalSeasons,
					seasonNumber,
					episodeNumber,
					director,
					tags: tags.split(','),
					likes,
					isActive,
					isDeleted,
					websiteId: websiteIds,
					imdb,
				});

				newMovie
					.save()
					.then((response) => {
						res.json(response);
					})
					.catch((err) => res.json(err));
			};

			S3.uploadNewBanner(req, res, dataBanner);
		};

		S3.uploadNewMedia(req, res, dataMedia);
	} else {
		const dataMedia = async (data1) => {
			const newMediaId = await new MediaModel({
				url: data1.Location || null,
				title: 'movie-image',
				mediaKey: data1.Key,
				alt: req.body.title || null,
			});
			newMediaId.save(newMediaId);

			const dataBanner = async (data2) => {
				const newBannerId = await new MediaModel({
					url: data2.Location || null,
					title: 'movie-banner',
					mediaKey: data2.Key,
					alt: req.body.title || null,
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
					director,
					tags,
					likes,
				} = req.body;

				const newMovie = await new MoviesModel({
					title,
					episodeTitle,
					type,
					year,
					duration,
					mediaId: newMediaId._id,
					bannerId: newBannerId._id,
					cast: cast.split(','),
					description,
					genre: typeof genre === 'string' ? JSON.parse(genre) : genre,
					ageRestriction,
					totalSeasons,
					seasonNumber,
					episodeNumber,
					director,
					tags: tags.split(','),
					likes,
					isActive,
					isDeleted,
					imdb,
				});

				newMovie
					.save()
					.then((response) => {
						res.json(response);
					})
					.catch((err) => res.json(err));
			};

			S3.uploadNewBanner(req, res, dataBanner);
		};

		S3.uploadNewMedia(req, res, dataMedia);
	}
};

exports.getSingleMovie = async (req, res) => {
	await MoviesModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	})
		.populate('mediaId', 'url title alt')
		.populate('bannerId', 'url title alt')
		.populate('websiteId', 'title link')
		.populate('genre', 'name');
};

exports.getMoviesByUserId = async (req, res) => {
	await MoviesModel.find({ userId: req.params.userId }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	})
		.populate('mediaId', 'url title alt')
		.populate('bannerId', 'url title alt');
};

exports.updateSingleMovie = async (req, res) => {
	console.log(req.body);

	await MoviesModel.findById({ _id: req.params.id })
		.then(async (movie) => {
			await MediaModel.findById({ _id: movie.mediaId }).then(async (media) => {
				const data = async (data) => {
					await MediaModel.findByIdAndUpdate(
						{ _id: movie.mediaId },
						{
							$set: {
								url: data.Location || null,
								title: 'movie-image',
								mediaKey: data.Key,
								alt: req.body.title || null,
							},
						},
						{ useFindAndModify: false, new: true }
					).catch((err) => res.json({ message: err, status: false }));
				};
				await S3.updateMedia(req, res, media.mediaKey, data);
			});

			await MediaModel.findById({ _id: movie.bannerId }).then(async (banner) => {
				const data = async (data) => {
					await MediaModel.findByIdAndUpdate(
						{ _id: movie.bannerId },
						{
							$set: {
								url: data.Location || null,
								title: 'movie-banner',
								mediaKey: data.Key,
								alt: req.body.title || null,
							},
						},
						{ useFindAndModify: false, new: true }
					).catch((err) => res.json({ message: err, status: false }));
				};
				await S3.updateBanner(req, res, banner.mediaKey, data);
			});

			await movie.websiteId.map(async (web, index) => {
				await WebsiteModel.findByIdAndUpdate(
					{ _id: web },
					{
						$set: JSON.parse(req.body.websiteId)[index],
					},
					{ useFindAndModify: false, new: true }
				);
			});

			const {
				imdb,
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
			} = req.body;

			await MoviesModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: {
						title,
						episodeTitle,
						type,
						year,
						duration,
						mediaId: movie.mediaId,
						bannerId: movie.bannerId,
						cast: cast.split(','),
						description,
						genre: typeof genre === 'string' ? JSON.parse(genre) : genre,
						ageRestriction,
						totalSeasons,
						seasonNumber,
						episodeNumber,
						director,
						tags: tags.split(','),
						websiteId: movie.websiteId,
						likes: req.body.likes ? req.body.likes : movie.likes,
						isActive: req.body.isActive ? req.body.isActive : movie.isActive,
						isDeleted: req.body.isDeleted
							? req.body.isDeleted
							: movie.isDeleted,
						imdb,
						userRating: req.body.userRating
							? [...movie.userRating, req.body.userRating]
							: movie.userRating,
					},
				}
			)

				.then((data) =>
					res.json({
						status: true,
						message: 'Movie is updated successfully',
						data,
					})
				)

				.catch((err) => res.json({ message: err, status: 401 }));
		})
		.catch((err) => res.json({ message: err, status: 402 }));
};

exports.removeSingleMovie = async (req, res) => {
	await MoviesModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
