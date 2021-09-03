const LikedModel = require('../model/Liked.model');

exports.getAll = async (req, res) => {
	try { 
		const { page = 1, limit } = req.query;
		const response = await LikedModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate({
				path:'userId',
				model:'user',
				select:'firstname lastname mediaId',
				populate:{
					path:'mediaId',
					model:'media',
					select:'url'
				} 
			})	
			.populate('movieId','type imdb_id original_title');  
			
		const total = await LikedModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	const newLikedList = await new LikedModel({
		userId: req.body.userId,
		movieId: req.body.movieId,
        isActive: req.body.isActive,
		isDeleted: req.body.isDeleted,
	}); 

	newLikedList
		.save() 
		.then((response) =>
			res.json({
				status: 200,
				message: 'New watchlist is created successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: false, message: err }));
};

exports.getSingleLiked = async (req, res) => {
	await LikedModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: false, message: err });
		} else {
			res.json({ data });
		}
	})
	.populate({
        path:'userId',
        model:'user',
        select:'firstname lastname mediaId',
        populate:{
            path:'mediaId',
            model:'media',
            select:'url'
        }
    })
		.populate('movieId','type imdb_id original_title');
};

exports.getLikedByUserId = async (req, res) => {
	await LikedModel.find({ userId: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: false, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
	.populate({
        path:'userId',
        model:'user',
        select:'firstname lastname mediaId',
        populate:{
            path:'mediaId',
            model:'media',
            select:'url'
        }
    })
		;
};


exports.updateLiked = async (req, res) => {
	await LikedModel.findByIdAndUpdate(
		{ _id: req.params.id }, 
		{ $set: {
			userId:req.body.userId,
			movieId: typeof req.body.movieId==='string' ? JSON.parse(req.body.movieId):req.body.movieId,
			isActive: !req.body.isActive ? true : req.body.isActive,
			isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,

		} })
		.then((data) => res.json({ message: 'Successfully updated', data }))
		.catch((err) => res.json({ message: err }));
};

exports.removeSingleLiked = async (req, res) => {
	await LikedModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: false, message: err }));
};
 