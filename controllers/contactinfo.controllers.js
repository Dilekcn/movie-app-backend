const mongoose = require('mongoose');
const ContactInfoModel = require('../model/ContactInfo.model');

exports.getAllContactInfo = async (req, res) => {
	try {
		const response = await ContactInfoModel.find();
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};
