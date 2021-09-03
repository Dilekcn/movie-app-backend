const NotificationModel = require('../model/Notification.model');

exports.getAllNotifications = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;

		const response = await NotificationModel.find()
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
		const total = await NotificationModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response })
		
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.createNotification = async (req, res) => {
	const newNotification = await new NotificationModel({
		userId: req.body.userId,
		title: req.body.title,
		content: req.body.content,  
		isRead: req.body.isRead,
		isDeleted: req.body.isDeleted,
	});

	newNotification
		.save()
		.then((response) =>
			res.json({
				status: 200,
				message: 'New notification is created successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: false, message: err }));
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
