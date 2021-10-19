const ComplaintModel = require('../model/Complaint.model');


exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;

		const response = await ComplaintModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
            .populate('commentId','title content userId')
			.populate('userId','firstname lastname')
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

exports.getSingleComplaint = async (req, res) => {

	ComplaintModel.findById({ _id: req.params.id })
		.populate('commentId','title content userId')
		.populate('userId','firstname lastname')
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err, status: false }));

};


exports.updateComplaint = async (req, res) => {
	await ComplaintModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json({ message: 'Successfully updated', data }))
		.catch((err) => res.json({ message: err }));
};

exports.removeComplaint = async (req, res) => {
	await ComplaintModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json({  status: 200, message: 'Successfully deleted' }))
		.catch((err) => res.json({ status: false, message: err }));
};
