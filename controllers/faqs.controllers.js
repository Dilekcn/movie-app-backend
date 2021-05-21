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
