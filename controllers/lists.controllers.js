const ListsModel = require('../model/List.model');

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await ListsModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			// .populate('userId')
			// .populated('mediaId')
			.populate('userRating')
			.populate('movieIds')
		const total = await ListsModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	const data = async (data) => {
		const newMedia = await new MediaModel({
			url: data.Location || null,
			title: 'users',
			mediaKey: data.Key,
			alt: req.body.alt || null,
		});

		newMedia.save();
	const {
		userId,
		name,
		description,
		isPublic,
		isActive,
		isDeleted,
		rating,
		userRating,
		movieIds,
		mediaId
	} = req.body;
	const newList = await new ListsModel({
		userId,
		name,
		description,
		isPublic,
		isActive,
		isDeleted,
		rating,
		userRating,
		movieIds,
		mediaId:newMedia._id,
	});
	newList
		.save()
		.then((response) => res.json(response))
		.catch((err) => res.json(err));
    }
	await S3.uploadNewMedia(req, res, data);
};

exports.getSingleList = async (req, res) => {
	await ListsModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err })
		} else { 
			res.json(data);
		}
	})
	// .populate('userId')
	// .populated('mediaId')
	.populate('userRating')
	.populate('movieIds')
};

exports.getListByUserId = async (req, res) => {
	await ListsModel.find({ userId: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	})
	// .populate('userId')
	// .populated('mediaId')
	.populate('userRating')
	.populate('movieIds')
};

exports.updateList = async (req, res) => {
	await ListsModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};

exports.removeSingleList = async (req, res) => {
	await ListsModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
