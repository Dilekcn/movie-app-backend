const mongoose = require('mongoose');

const RolesModel = require('../model/Role.model');

exports.getAllRoles = async (req, res) => {
	try {
		const response = await RolesModel.find();
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.createRole = async (req, res) => {
	const { name, isActive, isDeleted } = req.body;

	const newRole = await new RolesModel({ name, isActive, isDeleted });

	newRole
		.save()
		.then((data) =>
			res.json({
				status: true,
				message: 'Added new role successfully',
				data,
			}),
		)
		.catch((err) => res.json({ status: false, message: err }));
};

exports.getSingleRoleById = async (req, res) => {
	await RolesModel.findById({ _id: req.params.roleid }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.updateRole = async (req, res) => {
	await RolesModel.findByIdAndUpdate(
		{ _id: req.params.roleid },
		{ $set: req.body },
	)
		.then((data) => res.json({ message: 'Successfully updated', data }))
		.catch((err) => res.json({ message: err }));
};

exports.removeRole = async (req, res) => {
	await RolesModel.findByIdAndDelete({ _id: req.params.roleid })
		.then((data) => res.json({ message: 'Successfully removed', data }))
		.catch((err) => res.json({ message: err }));
};
