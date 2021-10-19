const CompanyProfileModel = require('../model/CompanyProfile.model');
const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');

exports.getAll = async (req, res) => {
	try {
		const { page, limit } = req.query;

		const response = await CompanyProfileModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('logo', 'url title alt');
		const total = await CompanyProfileModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};

exports.getCompanyProfileById = (req, res) => {
	const id = req.params.id;

	CompanyProfileModel.findById({ _id: id })
		.populate('logo', 'url title alt')
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err, status: false }));
};

exports.createCompanyProfile = async (req, res) => {
	if (req.files) {
		const data = async (data) => {
			const newMedia = await new MediaModel({
				url: data.Location || null,
				title: 'company-logo',
				alt: req.body.alt || null,
				mediaKey: data.Key,
			});

			newMedia.save();

			const {
				name,
				address,
				email,
				copyright,
				phone,
				socialMediaLinks,
				isActive,
				isDeleted,
			} = req.body;

			const newCompanyProfile = new CompanyProfileModel({
				name,
				logo: newMedia._id,
				address,
				email,
				copyright,
				phone,
				socialMediaLinks:
					typeof socialMediaLinks === 'string'
						? JSON.parse(socialMediaLinks)
						: socialMediaLinks,
				isActive,
				isDeleted,
			});

			newCompanyProfile
				.save()
				.then((data) =>
					res.json({
						status: 200,
						message: 'New company profile is created successfully',
						data,
					})
				)
				.catch((err) => res.json({ status: 404, message: err }));
		};
		await S3.uploadNewLogo(req, res, data);
	} else if (req.body.logo) {
		const {
			name,
			address,
			email,
			phone,
			copyright,
			socialMediaLinks,
			isActive,
			isDeleted,
			logo,
		} = req.body;

		const newCompanyProfile = new CompanyProfileModel({
			name,
			logo,
			address,
			email,
			copyright,
			phone,
			socialMediaLinks:
				typeof socialMediaLinks === 'string'
					? JSON.parse(socialMediaLinks)
					: socialMediaLinks,
			isActive,
			isDeleted,
		});

		newCompanyProfile
			.save()
			.then((data) =>
				res.json({
					status: 200,
					message: 'New company profile is created successfully',
					data,
				})
			)
			.catch((err) => res.json({ status: 404, message: err }));
	} else {
		const data = async (data) => {
			const newMedia = await new MediaModel({
				url: data.Location || null,
				title: 'company-logo',
				alt: req.body.alt || null,
				mediaKey: data.Key,
			});

			newMedia.save();

			const {
				name,
				address,
				email,
				copyright,
				phone,
				socialMediaLinks,
				isActive,
				isDeleted,
			} = req.body;

			const newCompanyProfile = new CompanyProfileModel({
				name,
				logo: newMedia._id,
				address,
				email,
				copyright,
				phone,
				socialMediaLinks:
					typeof socialMediaLinks === 'string'
						? JSON.parse(socialMediaLinks)
						: socialMediaLinks,
				isActive,
				isDeleted,
			});

			newCompanyProfile
				.save()
				.then((data) =>
					res.json({
						status: 200,
						message: 'New company profile is created successfully',
						data,
					})
				)
				.catch((err) => res.json({ status: 404, message: err }));
		};
		await S3.uploadNewLogo(req, res, data);
	}
};

exports.updateCompanyProfile = async (req, res) => {
	if (req.files) {
		await CompanyProfileModel.findById({ _id: req.params.id })
			.then(async (companyprofile) => {
				await MediaModel.findById({
					_id: companyprofile.logo,
				}).then(async (media) => {
					const data = async (data) => {
						await MediaModel.findByIdAndUpdate(
							{
								_id: companyprofile.logo,
							},
							{
								$set: {
									url: data.Location || null,
									title: 'company-logo',
									mediaKey: data.Key,
									alt: req.body.alt,
								},
							},
							{ useFindAndModify: false, new: true }
						).catch((err) => res.json({ status: 404, message: err }));
					};
					await S3.updateLogo(req, res, media.mediaKey, data);
				});

				const { name, address, email, phone, copyright, socialMediaLinks } =
					req.body;

				await CompanyProfileModel.findByIdAndUpdate(
					{ _id: req.params.id },
					{
						$set: {
							name: req.body.name ? req.body.name : companyprofile.name,
							logo: req.files ? companyprofile.logo : req.body.logo,
							phone:req.body.phone ? req.body.phone : companyprofile.phone,
							address:req.body.address ? req.body.address : companyprofile.address,
							socialMediaLinks:
								typeof socialMediaLinks === 'string'
									? JSON.parse(socialMediaLinks)
									: socialMediaLinks,
							email:req.body.email ? req.body.email : companyprofile.email,
							copyright:req.body.copyright ? req.body.copyright : companyprofile.copyright,
							isActive: !req.body.isActive ? companyprofile.isActive : req.body.isActive,
							isDeleted: !req.body.isDeleted ? companyprofile.isDeleted : req.body.isDeleted,
						},
					},
					{ useFindAndModify: false, new: true }
				)
					.then((companyprofile) =>
						res.json({
							status: 200,
							message: 'Company profile is updated successfully',
							companyprofile,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			})
			.catch((err) => res.json({ status: 404, message: err }));
	} else {
		await CompanyProfileModel.findById({ _id: req.params.id })
			.then(async (companyprofile) => {
				const { name, address, email, copyright, logo, socialMediaLinks, phone } =
					req.body;

				await CompanyProfileModel.findByIdAndUpdate(
					{ _id: req.params.id },
					{
						$set: {
							name: req.body.name ? req.body.name : companyprofile.name,
							logo: !logo ? companyprofile.logo : logo,
							phone:req.body.phone ? req.body.phone : companyprofile.phone,
							address:req.body.address ? req.body.address : companyprofile.address,
							socialMediaLinks:
								typeof socialMediaLinks === 'string'
									? JSON.parse(socialMediaLinks)
									: socialMediaLinks,
							email,
							copyright:req.body.copyright ? req.body.copyright : companyprofile.copyright,
							isActive: !req.body.isActive ? companyprofile.isActive : req.body.isActive,
							isDeleted: !req.body.isDeleted ? companyprofile.isDeleted : req.body.isDeleted,
						},
					},
					{ useFindAndModify: false, new: true }
				)
					.then((companyprofile) =>
						res.json({
							status: 200,
							message: 'Company profile is updated successfully',
							companyprofile,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			})
			.catch((err) => res.json({ status: 404, message: err }));
	}
};

exports.removeCompanyProfile = (req, res) => {
	const id = req.params.id;
	CompanyProfileModel.findByIdAndDelete({ _id: id })
		.then((data) =>
			res.json({
				status: 200,
				message: 'Company profile is deleted successfully',
				data,
			})
		)
		.catch((err) => res.json({ message: err, status: false }));
};
