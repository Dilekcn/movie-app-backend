const UserModel = require('../model/User.model');
const Media = require('../model/Media.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const S3 = require('../config/aws.s3.config');

exports.getAllUsers = async (req, res) => {
	await UserModel.find()
		.populate('mediaId', 'url')
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};

exports.getSingleUser = async (req, res) => {
	await UserModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.createUser = async (req, res) => {
	const data = async (data) => {
		const newMedia = await new Media({
			url: data.Location || null,
			title: 'users',
			mediaKey: data.Key,
		});
		newMedia.save();

		const { firstname, lastname, email, password, country, isActive, isDeleted } =
			req.body;
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = await new UserModel({
			firstname,
			lastname,
			email,
			country,
			mediaId: newMedia._id,
			password: hashedPassword,
			isActive,
			isDeleted,
		});
		newUser
			.save()
			.then((response) =>
				res.json({ status: true, message: 'Signed up successfully.', response })
			)
			.catch((err) => res.json({ status: false, message: err }));
	};
	await S3.uploadNewMedia(req, res, data);
};

exports.login = async (req, res) => {
	const { email, password } = req.body;

	await UserModel.findOne({ email: email })
		.then(async (data) => {
			if (await bcrypt.compare(password, data.password)) {
				const token = jwt.sign(
					{ name: email, role: data.role },
					process.env.ACCESS_TOKEN_SECRET,
					{ expiresIn: '1h' }
				);
				res.json({
					status: true,
					firstname: data.firstname,
					lastname: data.lastname,
					email: data.email,
					country: country,
					isActive: isActive,
					isDeleted: isDeleted,
					id: data._id,
					mediaId: data.mediaId,
					token: token,
				});
			} else {
				res.json({ status: false, message: 'Wrong password' });
			}
		})
		.catch((err) => res.json({ message: 'Email does not exist' }));
};

exports.updateUser = async (req, res) => {
	await UserModel.findById({ _id: req.params.id })
		.then(async (user) => {
			await MediaModel.findById({ _id: user.mediaId })
				.then(async (media) => {
					const data = async (data) => {
						await Media.findByIdAndUpdate(
							{ _id: data.mediaId },
							{
								$set: {
									url: req.body.mediaId.url,
									title: 'users',
									mediaKey: data.Key,
								},
							},
							{ useFindAndModify: false, new: true }
						).then(async (updatedMedia) => {
							const {
								firstname,
								lastname,
								email,
								country,
								isActive,
								isDeleted,
							} = req.body;
							await UserModel.findByIdAndUpdate(
								{ _id: req.params.id },
								{
									$set: {
										firstname: firstname,
										lastname: lastname,
										email: email,
										country: country,
										mediaId: data.mediaId,
										isActive: isActive,
										isDeleted: isDeleted,
									},
								}
							).then((data) =>
								res.json({
									status: true,
									message: 'Successfully updated.',
									data,
								})
							);
						});
					};
					await S3.updateMedia(req, res, media.mediaKey, data);
				})
				.catch((err) => res.json({ status: false, message: err }));
		})
		.catch((err) => res.json({ status: false, message: err }));
};

exports.deleteUser = async (req, res) => {
	await UserModel.findByIdAndRemove({ _id: req.params.id })
		.then((data) => res.json({ message: 'Successfully removed.', data }))
		.catch((err) => res.json({ message: err }));
};

// exports.deleteUser = async (req, res) => {
// 	await UserModel.findByIdAndDelete({ _id: req.params.id })
// 		.then(async (user) => {
// 			await MediaModel.findById({ _id: user.mediaId }).then(async (media) => {
// 				S3.deleteMedia(media.mediaKey);
// 				await MediaModel.findByIdAndDelete({ _id: user.mediaId });
// 			});
// 			res.json(user);
// 		})
// 		.then((data) => res.json({ message: 'User is removed successfully.', data }))
// 		.catch((err) => res.json({ message: err }));
// };
