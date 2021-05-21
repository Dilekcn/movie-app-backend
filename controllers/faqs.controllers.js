const mongoose = require('mongoose');

const FaqModel = require('../model/Faq.model');

exports.getAllFaqs = async (req, res) => {
	try {
		const response = await FaqModel.find();
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.createFaq = async (req, res) => {
	const newFaq = await new FaqModel({
		question: req.body.question,
		answer: req.body.answer,
		isActive: req.body.isActive,
		isDeleted: req.body.isDeleted,
	});

	newFaq
		.save()
		.then((data) =>
			res.json({
				status: true,
				message: 'Added new faq successfully.',
				data,
			}),
		)
		.catch((err) => res.json({ status: false, message: err }));
};
