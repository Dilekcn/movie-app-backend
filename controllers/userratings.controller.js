const UserRatingModel = require('../model/UserRatings.model');


exports.getAll = async (req, res) => {
	try {
		const { page, limit } = req.query;
 
		const response = await UserRatingModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('userId','firstname lastname')
			.populate('listId','name')
		
		const total = await UserRatingModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};

exports.getRatingById = (req, res) => {
	const id = req.params.id;
	UserRatingModel.findById({ _id: id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err, status: false })); 
};

exports.create = async (req, res) => {
	const newRating = await new UserRatingModel({
		userId: req.body.userId,
		rating: req.body.rating,
		listId: req.body.listId,
		movieId:req.body.movieId,
		isActive: req.body.isActive,
		isDeleted: req.body.isDeleted,
	});

	newRating
		.save()
		.then((response) =>
			res.json({
				status: 200,
				message: 'New rating is created successfully',
				response,
			})  
		)
		.catch((err) => res.json({ status: false, message: err }));
};

exports.updateRating = async (req, res) => {
	await FaqModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json({ message: 'Successfully updated', data }))
		.catch((err) => res.json({ message: err }));
};

exports.removeRating = (req, res) => {
	const id = req.params.id;
	UserRatingModel.findByIdAndDelete({ _id: id })
		.then((data) =>
			res.json({
				status: 200,
				message: 'Rating is deleted successfully',
				data,
			})   
		)
		.catch((err) => res.json({ message: err, status: false }));  
};
