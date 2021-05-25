const express = require('express');
const router = express.Router();

const notificationControllers = require('../controllers/notification.controllers')

router.get('/notifications',notificationControllers.getAllNotifications);
router.post('/notification', notificationControllers.createNotification);
router.put('/notification/:notificationId', notificationControllers.updateSingleNotification);
router.delete('/notification/:notificationId', notificationControllers.deleteNotification);



module.exports = router