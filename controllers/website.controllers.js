const WebsiteModel = require('../model/Website.model');
const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');

exports.getAll = async (req, res) => {
	try {
		const { page, limit } = req.query;
		const total = await WebsiteModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);

		const response = await WebsiteModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('logo', 'url title alt');
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};

exports.create = async (req, res) => {
	const data = async (data) => {
		const newMedia = await new MediaModel({
			url: data.Location || null,
			title: 'website-logo',
			alt: req.body.alt || null,
			mediaKey: data.Key,
		});

		newMedia.save();

		const { title, link, isActive, isDeleted } = req.body;

		const newWebsite = new WebsiteModel({
			title,
			link,
			logo: newMedia._id,
			isActive,
			isDeleted,
		});

		newWebsite
			.save()
			.then((data) =>
				res.json({
					status: 200,
					message: 'New website is created successfully',
					data,
				})
			)
			.catch((err) => res.json({ status: 404, message: err }));
	};
	await S3.uploadNewLogo(req, res, data);
};

exports.getSingleWebsite = async (req, res) => {
	await WebsiteModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	}).populate('logo', 'url title alt');
};

exports.updateSingleWebsite = async (req, res) => {
	await WebsiteModel.findById({ _id: req.params.id })
		.then(async (website) => {
			await MediaModel.findById({
				_id: website.logo,
			}).then(async (media) => {
				const data = async (data) => {
					await MediaModel.findByIdAndUpdate(
						{
							_id: website.logo,
						},
						{
							$set: {
								url: data.Location || null,
								title: 'website-logo',
								mediaKey: data.Key,
								alt: req.body.alt,
							},
						},
						{ useFindAndModify: false, new: true }
					).catch((err) => res.json({ status: 404, message: err }));
				};
				await S3.updateLogo(req, res, media.mediaKey, data);
			});

			const { title, link } = req.body;

			await WebsiteModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: {
						title,
						link,
						logo: website.logo,
						isActive: !req.body.isActive ? true : req.body.isActive,
						isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
					},
				},
				{ useFindAndModify: false, new: true }
			)
				.then((response) =>
					res.json({
						status: 200,
						message: 'Website is updated successfully',
						response,
					})
				)
				.catch((err) => res.json({ status: 404, message: err }));
		})
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.removeSingleWebsite = async (req, res) => {
	await WebsiteModel.findById({ _id: req.params.id })
		.then(async (website) => {
			await MediaModel.findByIdAndUpdate(
				{ _id: website.logo },
				{
					$set: { isActive: false },
				},
				{ useFindAndModify: false, new: true }
			);

			await WebsiteModel.findByIdAndDelete({ _id: req.params.id })
				.then(async (data) => {
					res.json({
						status: 200,
						message: 'Website is deleted successfully',
						data,
					});
				})
				.catch((err) => res.json({ status: 404, message: err }));
		})
		.catch((err) => res.json({ status: 404, message: err }));
};
