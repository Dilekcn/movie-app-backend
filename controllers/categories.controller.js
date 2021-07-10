const mongoose = require('mongoose');
const CategoriesModel = require('../model/Category.model');
const TrailersModel = require('../model/Trailer.model')

exports.getAll = async (req, res) => {
	try {
		const update = await CategoriesModel.find()
		update.map(async(item, index) => {
			const count = await TrailersModel.count({genre: {$in: item._id.toString()}})
			await CategoriesModel.findByIdAndUpdate({_id:item._id}, {$set: {movieCount: count}})
		})
		const response = await CategoriesModel.find().sort({ createdAt: -1 });
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	const newCategory = await new CategoriesModel({
		name: req.body.name,
		description: req.body.description,
		movieCount: req.body.movieCount,
		isActive: req.body.isActive,
		isDeleted: req.body.isDeleted,
	});

	newCategory
		.save()
		.then((response) => res.json(response))
		.catch((err) => res.json(err));
};

exports.getSingleCategory = async (req, res) => {
	await CategoriesModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.updateSingleCategory = (req, res) => {
	CategoriesModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json({ message: 'Category updated', status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
};

exports.removeSingleCategory = async (req, res) => {
	await CategoriesModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
