const TrailersModel = require('../model/Trailer.model');
const mediaModel = require('../model/Media.model');
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
      .populate("mediaId", "url title alt")
      .populate("bannerId", "url title alt")
      .populate("websiteId", "title link")
      .populate("genre")
    const total = await TrailersModel.find().count();
    const pages = limit === undefined ? 1 : Math.ceil(total / limit);
    res.json({ total: total, pages, status: 200, response });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.create = async (req, res) => {
	if (req.body.websiteId) {
		const newWebsite = await req.body.websiteId.map((web) => {
			const website = JSON.parse(web);
			return new WebsiteModel({
				title: website.title || null,
				link: website.link || null,
			});
		});
		newWebsite.map((web) => web.save());
		const websiteIds = newWebsite.map((web) => web._id);

		const dataMedia = async (data1) => {
			const newMediaId = await new mediaModel({
				url: data1.Location || null,
				title: 'trailer-image',
				mediaKey: data1.Key,
				alt: req.body.title || null,
			});
			newMediaId.save(newMediaId);

			const dataBanner = async (data2) => {
				const newBannerId = await new mediaModel({
					url: data2.Location || null,
					title: 'trailer-banner',
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
					likes,
					isActive,
					isDeleted,
					websiteId: websiteIds,
					imdb,
				});

				newTrailer
					.save()
					.then((response) => {
						res.json(response);
					})
					.catch((err) => res.json(err));
			};

<<<<<<< HEAD
      S3.uploadNewMedia(req, res, dataBanner);
    };
=======
			S3.uploadNewBanner(req, res, dataBanner);
		};
>>>>>>> eaaf3d9adfaf4a7b1a569f03830ed92ecb2cfa04

		S3.uploadNewMedia(req, res, dataMedia);
	} else {
		const dataMedia = async (data1) => {
			const newMediaId = await new mediaModel({
				url: data1.Location || null,
				title: 'trailer-image',
				mediaKey: data1.Key,
				alt: req.body.title || null,
			});
			newMediaId.save(newMediaId);

			const dataBanner = async (data2) => {
				const newBannerId = await new mediaModel({
					url: data2.Location || null,
					title: 'trailer-banner',
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
					likes,
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
			};

			S3.uploadNewBanner(req, res, dataBanner);
		};
<<<<<<< HEAD
  
		S3.uploadNewMedia(req, res, dataBanner);
	  };
  
	  S3.uploadNewMedia(req, res, dataMedia);
=======
>>>>>>> eaaf3d9adfaf4a7b1a569f03830ed92ecb2cfa04

		S3.uploadNewMedia(req, res, dataMedia);
	}
};

exports.getSingleTrailer = async (req, res) => {
	await TrailersModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	})
		.populate('mediaId', 'url title alt')
		.populate('bannerId', 'url title alt')
		.populate('websiteId', 'title link');
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
		.populate('bannerId', 'url title alt');
};

exports.updateSingleTrailer = async (req, res) => {
	console.log(req.body);

	await TrailersModel.findById({ _id: req.params.id })
		.then(async (trailer) => {
			// await MediaModel.findById({ _id: trailer.mediaId }).then(
			// 		async (media) => {
			// 		const data = async (data) => {
			// 			await MediaModel.findByIdAndUpdate(
			// 			{ _id: trailer.mediaId },
			// 			{
			// 				$set: {
			// 				url: data.Location || null,
			// 				title: "trailer-image",
			// 				mediaKey: data.Key,
			// 				alt: req.body.title || null,
			// 				},
			// 			},
			// 			{ useFindAndModify: false, new: true }
			// 			).catch((err) => res.json({ message: err, status: false }));
			// 		};
			// 		await S3.updateMedia(req, res, media.mediaKey, data);
			// 		}
			// 	);

			//   await MediaModel.findById({ _id: trailer.bannerId }).then(
			// 	    async (banner) => {
			// 	      console.log(banner);
			// 	      const data = async (data) => {
			// 	        await MediaModel.findByIdAndUpdate(
			// 	          { _id: trailer.bannerId },
			// 	          {
			// 	            $set: {
			// 	              url: data.Location || null,
			// 	              title: "trailer-banner",
			// 	              mediaKey: data.Key,
			// 	              alt: req.body.title || null,
			// 	            },
			// 	          },
			// 	          { useFindAndModify: false, new: true }
			// 	        ).catch((err) => res.json({ message: err, status: false }));
			// 	      };
			// 	      await S3.updateBanner(req, res, banner.mediaKey, data);
			// 	    }
			// 	  );

			await trailer.websiteId.map(async (web, index) => {
				await WebsiteModel.findByIdAndUpdate(
					{ _id: web },
					{
						$set: JSON.parse(req.body.websiteId)[index],
					}
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
				trailerUrl,
				likes,
				userRating,
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
						mediaId: trailer.mediaId,
						websiteId: trailer.websiteId,
						likes: req.body.likes ? req.body.likes : trailer.likes,
						isActive: req.body.isActive
							? req.body.isActive
							: trailer.isActive,
						isDeleted: req.body.isDeleted
							? req.body.isDeleted
							: trailer.isDeleted,
						imdb,
						userRating: req.body.userRating
							? [...trailer.userRating, req.body.userRating]
							: trailer.userRating,
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
