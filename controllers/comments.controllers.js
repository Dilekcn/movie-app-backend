const mongoose = require('mongoose');
const CommentsModel = require('../model/Comment.model');

exports.getAll = async (req, res) => {
	try {
		const response = await CommentsModel.find()
			.sort({ createdAt: -1 })
			.populate('userId', 'firstname lastname')
			.populate('listId', 'name');
		res.json(response);
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
		.then((response) =>
			res.json({
				status: 200,
				message: 'New comment is created successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: false, message: err }));
};

exports.getSingleComment = async (req, res) => {
	await CommentsModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: false, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
		.populate('userId', 'firstname lastname')
		.populate('listId', 'name');
};

exports.getCommentsByUserId = async (req, res) => {
	await CommentsModel.find({ userId: req.params.userid }, (err, data) => {
		if (err) {
			res.json({ status: false, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
		.populate('userId', 'firstname lastname')
		.populate('listId', 'name');
};

exports.getCommentsByList = async (req, res) => {
	await CommentsModel.find({ listId: req.params.listid }, (err, data) => {
		if (err) {
			res.json({ status: false, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
		.populate('userId', 'firstname lastname')
		.populate('listId', 'name');
};

exports.updateComment = async (req, res) => {
	await CommentsModel.findById({ _id: req.params.id })
		.then(async (comment) => {
			await CommentsModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					userId: comment.userId,
					title: comment.title,
					content: comment.content,
					listId: comment.listId,
					isActive: !req.body.isActive ? true : req.body.isActive,
					isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
				},
				{ useFindAndModify: false, new: true }
			)
				.then((comment) =>
					res.json({
						status: 200,
						message: 'Comment is updated successfully',
						comment,
					})
				)
				.catch((err) => res.json({ status: false, message: err }));
		})
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: false, message: err }));
};

exports.removeSingleComment = async (req, res) => {
	await CommentsModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: false, message: err }));
};
