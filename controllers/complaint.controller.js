const ComplaintModel = require('../model/Complaint.model');

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;

		const response = await ComplaintModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
            .populate({
				path:'commnetId',
				model:'comment',
				select:'title content userId',
				populate:{
					path:'userId',
					model:'user',
					select:'_id firstname lastname'
				}
			})
                      
		const total = await ComplaintModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	const {
		title,
		reason,
		userId,
		commentId,
		isActive,
		isDeleted,
    	} = req.body;
	const newList = await new ComplaintModel({
		title,
		reason,
		userId,
		commentId,
		isActive,
		isDeleted,
	});
	newList
		.save()
		.then((response) => res.json(response))
		.catch((err) => res.json(err));
};

exports.getSingleList = async (req, res) => {
	await ComplaintModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};
