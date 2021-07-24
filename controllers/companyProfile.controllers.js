const CompanyProfileModel = require('../model/CompanyProfile.model');

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;

		const response = await CompanyProfileModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await CompanyProfileModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.getCompanyProfileById = (req, res) => {
	const id = req.params.id;

	CompanyProfileModel.findById({ _id: id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err, status: false }));
};

exports.createCompanyProfile = (req, res) => {
	const newCompanyProfile = new CompanyProfileModel({
		logo: req.body.logo,
		address: req.body.address,
		email: req.body.email,
		phone: req.body.phone,
		socialMediaLinks: req.body.socialMediaLinks,
		copyright: req.body.copyright,
	});

	newCompanyProfile
		.save()
		.then((data) => res.json({ status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
};

exports.updateCompanyProfile = (req, res) => {
	const id = req.params.id;
	CompanyProfileModel.findByIdAndUpdate({ _id: id }, { $set: req.body })
		.then((data) => res.json({ status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
};

exports.removeCompanyProfile = (req, res) => {
	const id = req.params.id;
	CompanyProfileModel.findByIdAndDelete({ _id: id })
		.then((data) => res.json({ status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
};
