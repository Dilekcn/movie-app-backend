const ListsModel = require('../model/List.model');
const UserRatingModel = require('../model/UserRatings.model');


exports.getAll = async (req, res) => {
	try { 
		const { page = 1, limit } = req.query;
		const response = await ListsModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('userId','firstname lastname') 
			.populate('userRatingIds')
			.populate('movieIds')
		const total = await ListsModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {

	const {
		userId,
		name,
		description,
		isPublic,
		isActive,
		isDeleted,
		rating,
		userRatingIds,

	} = req.body;
	const newList = await new ListsModel({
		userId,
		name,
		description,
		isPublic,
		isActive,
		isDeleted,
		rating,
		userRatingIds,
		movieIds:JSON.parse(req.body.movieIds),
		
	});
	newList
		.save()
		.then((response) => res.json(response))
		.catch((err) => res.json(err));
    }


exports.getSingleList = async (req, res) => {
	await ListsModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err })
		} else { 
			res.json(data);
		}
	})
	.populate('userId','firstname lastname') 
	.populate('userRatingIds')
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
	.populate('userId','firstname lastname') 
	.populate('userRatingIds')
	.populate('movieIds') 
};

exports.updateList = async (req, res) => {
		await ListsModel.findById({ _id: req.params.id })
			.then(async (list) => {
	
				const newUserRating =
					typeof req.body.userRatingIds === 'string'
						? await JSON.parse(req.body.userRatingIds).map(
								(userrating) => {
									return new UserRatingModel({
										userId: userrating.userId,
										listId: req.params.id, 
										rating: userrating.rating,
									});
								}
						  )
						: req.body.UserRatingModel.map((userrating) => {
								return new UserRatingModel({
									userId: userrating.userId,
									listId: req.params.id,
									rating: userrating.rating,
								});
						  });

				newUserRating.map((userrating) => userrating.save());

				const newUserRatingIds = newUserRating.map((userrating) => userrating._id);

				const {userId,name,description,rating,isPublic} =
					req.body;
				const newmovieids= typeof req.body.movieIds === 'string' ? JSON.parse(req.body.movieIds): req.body.movieIds
				await ListsModel.findByIdAndUpdate(
					{ _id: req.params.id },
					{
						$set: {
							userId,
							name, 
							description,
							rating,
							movieIds:newmovieids,
							isPublic,
							userRatingIds:newUserRatingIds,
							isActive: !req.body.isActive
								? true
								: req.body.isActive,
							isDeleted: !req.body.isDeleted
								? false
								: req.body.isDeleted,
						},
					},
					{ useFindAndModify: false, new: true }
				)
					.then((data) =>
						res.json({
							status: 200,
							message: 'List is updated successfully',
							data,
						})
					)
					.catch((err) => ({ status: 400, message: err }));
			})
			.catch((err) => ({ status: 400, message: err }));
	




























	await ListsModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err })); 
};

exports.removeSingleList = async (req, res) => {
	await ListsModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
