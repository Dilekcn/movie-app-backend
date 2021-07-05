const express = require('express');
const router = express.Router();

const notificationControllers = require('../controllers/notification.controllers');

router.get('/notifications', notificationControllers.getAllNotifications);
router.post('/notifications', notificationControllers.createNotification);
router.put(
	'/notifications/:notificationId',
	notificationControllers.updateSingleNotification
);
router.delete(
	'/notifications/:notificationId',
	notificationControllers.deleteNotification
);

module.exports = router;
