const UserModel = require('../model/User.model');
const Media = require('../model/Media.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.getAllUsers = async (req, res) => {
	await UserModel.find()
		.populate('profileImageId', 'url')
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
	const newMedia = await new Media({
		url: req.body.profileImageId.url || null,
		title: 'user',
		description: req.body.profileImageId.description || null,
	});

	const mediaUrl = newMedia._id;
	newMedia.save();
	const { firstname, lastname, email, password, country, isActive, isDeleted } =
		req.body;
	const salt = await bcrypt.genSalt();
	const hashedPassword = await bcrypt.hash(password, salt);

	const newUser = await new UserModel({
		firstname: firstname,
		lastname: lastname,
		email: email,
		country: country,
		profileImageId: mediaUrl,
		password: hashedPassword,
		isActive: isActive,
		isDeleted: isDeleted,
	});
	newUser
		.save()
		.then((data) =>
			res.json({ status: true, message: 'Signed up succesfully.', data })
		)
		.catch((err) => res.json({ status: false, message: err }));
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
					profileImageId: data.profileImageId,
					token: token,
				});
			} else {
				res.json({ status: false, message: 'Wrong password' });
			}
		})
		.catch((err) => res.json({ message: 'Email does not exist' }));
};

exports.updateUser = async (req, res) => {
	const { firstname, lastname, email, country, isActive, isDeleted } = req.body;
	await UserModel.findById({ _id: req.params.id })
		.then(async (data) => {
			await Media.findByIdAndUpdate(
				{ _id: data.profileImageId },
				{
					$set: req.body.profileImageId,
				}
			);
			await UserModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: {
						firstname: firstname,
						lastname: lastname,
						email: email,
						country: country,
						profileImageId: data.profileImageId,
						isActive: isActive,
						isDeleted: isDeleted,
					},
				}
			)
				.then((data) => res.json({ message: 'Successfully updated.', data }))
				.catch((err) => res.json({ message: err }));
		})
		.catch((err) => res.json({ message: err }));
};

exports.deleteUser = async (req, res) => {
	await UserModel.findByIdAndRemove({ _id: req.params.id })
		.then((data) => res.json({ message: 'Successfully removed.', data }))
		.catch((err) => res.json({ message: err }));
};
