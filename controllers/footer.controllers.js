const FooterModel = require('../model/Footer.model');

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;

		const response = await FooterModel.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
        const total = await FooterModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.getSingleFooterById = (req, res) => {
	const id = req.params.id;

	FooterModel.findById({ _id: id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err, status: false }));
};

exports.createFooter = (req, res) => {
	const newFooter = new FooterModel({
		logo: req.body.logo,
		address: req.body.address,
		email: req.body.email,
		phone: req.body.phone,
		socialMediaLinks: req.body.socialMediaLinks,
		copyright: req.body.copyright,
	});

	newFooter
		.save()
		.then((data) => res.json({ status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
};

exports.updateFooterById = (req, res) => {
	const id = req.params.id;
	FooterModel.findByIdAndUpdate({ _id: id }, { $set: req.body })
		.then((data) => res.json({ status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
};

exports.removeFooterById = (req, res) => {
	const id = req.params.id;
	FooterModel.findByIdAndDelete({ _id: id })
		.then((data) => res.json({ status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
};
