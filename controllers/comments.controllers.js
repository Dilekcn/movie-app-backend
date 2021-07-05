const mongoose = require('mongoose');
const CommentsModel = require('../model/Comment.model');

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await CommentsModel.find()
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.sort({ createdAt: -1 })
			.populate('userId', 'firstname lastname')
			.populate('listId', 'name');
				
			const total = await CommentsModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });

	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	const newComment = await new CommentsModel({
		userId: req.body.userId,
		title: req.body.title,
		content: req.body.content,
		listId: req.body.listId,
		isActive: req.body.isActive,
		isDeleted: req.body.isDeleted,
	});

	newComment
		.save()
		.then((response) => res.json(response))
		.catch((err) => res.json(err));
};

exports.getSingleComment = async (req, res) => {
	await CommentsModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.getCommentsByUserId = async (req, res) => {
	await CommentsModel.find({ userId: req.params.userid }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.getCommentsByList = async (req, res) => {
	await CommentsModel.find({ listId: req.params.listid }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.updateComment = async (req, res) => {
	await CommentsModel.findById({ _id: req.params.id })
		.then(async (comment) => {
			const { title, content } = req.body;
			await CommentsModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					userId: comment.userId,
					title,
					content,
					listId: comment.listId,
					isActive: !req.body.isActive ? true : req.body.isActive,
					isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
				},
				{ useFindAndModify: false, new: true }
			)
				.then((comment) =>
					res.json({
						status: true,
						message: 'Comment is updated successfully',
						comment,
					})
				)
				.catch((err) => res.json({ status: false, message: err }));
		})
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};

exports.removeSingleComment = async (req, res) => {
	await CommentsModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
