const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanyProfileSchema = new Schema(
	{
		logo: { type: String },
		address: { type: String },
		email: { type: String },
		phone: { type: String },
		socialMediaLinks: { type: Array },
		copyright: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('companyprofile', CompanyProfileSchema);