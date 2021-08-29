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
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};
 
exports.create = async (req, res) => {

		const { title, link, isActive, isDeleted } = req.body;
		const newWebsite = new WebsiteModel({
			title,
			link,
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

exports.getSingleWebsite = async (req, res) => {
	await WebsiteModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	})
};

exports.updateSingleWebsite = async (req, res) => {
	await WebsiteModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
	.then((data) => res.json({ message: 'Successfully updated', data }))
	.catch((err) => res.json({ message: err }));
};

exports.removeSingleWebsite = async (req, res) => {
	await WebsiteModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: false, message: err }));
};
