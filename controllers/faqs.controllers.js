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

exports.getSingleFaqById = async (req, res) => {
	await FaqModel.findById({ _id: req.params.faqid }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.getSingleFaqByQuestion = async (req, res) => {
	await FaqModel.findOne({ question: req.params.question }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.getSingleFaqByAnswer = async (req, res) => {
	await FaqModel.findOne({ answer: req.params.answer }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
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
				message: 'Added new faq successfully',
				data,
			}),
		)
		.catch((err) => res.json({ status: false, message: err }));
};

exports.updateFaq = async (req, res) => {
	await FaqModel.findByIdAndUpdate(
		{ _id: req.params.faqid },
		{ $set: req.body },
	)
		.then((data) => res.json({ message: 'Successfully updated', data }))
		.catch((err) => res.json({ message: err }));
};

exports.removeFaq = async (req, res) => {
	await FaqModel.findByIdAndDelete({ _id: req.params.faqid })
		.then((data) => res.json({ message: 'Successfully removed', data }))
		.catch((err) => res.json({ message: err }));
};
