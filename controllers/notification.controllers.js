const mongoose = require('mongoose');
const NotificationModel = require('../model/Notification.model');

exports.getAllNotifications = async (req, res) => {
	try {
		const response = await NotificationModel.find().sort({ createdAt: -1 });
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.createNotification = (req, res) => {
	const newNotification = new NotificationModel(req.bady);

	newNotification
		.save()
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.json(err);
		});
};

exports.deleteNotification = (req, res, next) => {
	NotificationModel.findByIdAndRemove({ _id: req.params.notificationId })
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			next({ message: 'The notification deleted.', code: 99 });
			res.json(err);
		});
};

exports.updateSingleNotification = (req, res) => {
	NotificationModel.findByIdAndUpdate(
		{ _id: req.params.notificationId },
		{ $set: req.body }
	)
		.then((data) => res.json({ message: 'Notification updated', status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
};
