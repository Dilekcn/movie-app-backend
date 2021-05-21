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

exports.createContactInfo = async (req, res) => {
	const { address, phone, email, socialMedia, isActive, isDeleted, userId } =
		req.body;
	const ContactInfo = await new ContactInfoModel({
		address,
		phone,
		email,
		socialMedia,
		isActive,
		isDeleted,
		userId,
	});

	ContactInfo.save()
		.then((data) =>
			res.json({
				status: true,
				message: 'Added new contact info successfully',
				data,
			}),
		)
		.catch((err) => res.json({ status: false, message: err }));
};
