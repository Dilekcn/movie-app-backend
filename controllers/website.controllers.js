const WebsiteModel = require('../model/Website.model');

exports.getAll = async (req, res) => {
	try {
		const response = await WebsiteModel.find().sort({ createdAt: -1 });
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	const newWebsite = await new WebsiteModel({
		title: req.body.title,
		link: req.body.link,
		isActive: req.body.isActive,
		isDeleted: req.body.isDeleted,
	});

	newWebsite
		.save()
		.then((response) => res.json(response))
		.catch((err) => res.json(err));
};

exports.getSingleWebsite = async (req, res) => {
	await WebsiteModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.updateSingleWebsite = (req, res) => {
	WebsiteModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json({ message: 'Website updated', status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
};

exports.removeSingleWebsite = async (req, res) => {
	await WebsiteModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
