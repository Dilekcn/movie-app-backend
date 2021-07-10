const mongoose = require('mongoose');
const WatchModel = require('../model/Watch.model');

exports.getAll = async (req, res) => {
	try {
		const response = await WatchModel.find().sort({ createdAt: -1 });
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	const newWatch = await new WatchModel({
		title: req.body.title,
		link: req.body.link,
		isActive: req.body.isActive,
		isDeleted: req.body.isDeleted,
	});

	newWatch
		.save()
		.then((response) => res.json(response))
		.catch((err) => res.json(err));
};

exports.getSingleWatch = async (req, res) => {
	await WatchModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.updateSingleWatch = (req, res) => {
	WatchModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json({ message: 'Watch updated', status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
};

exports.removeSingleWatch = async (req, res) => {
	await WatchModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
