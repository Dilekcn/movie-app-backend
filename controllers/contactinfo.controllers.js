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

exports.getSingleContactInfoById = async (req, res) => {
	await ContactInfoModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
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

exports.updateCreateInfo = async (req, res) => {
	await ContactInfoModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{ $set: req.body },
	)
		.then((data) => res.json({ message: 'Successfully updated', data }))
		.catch((err) => res.json({ message: err }));
};

exports.removeContactInfo = async (req, res) => {
	await ContactInfoModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json({ message: 'Successfully removed', data }))
		.catch((err) => res.json({ message: err }));
};
