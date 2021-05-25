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
