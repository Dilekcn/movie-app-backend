var express = require('express');
var router = express.Router();

const UserRatingsControllers = require('../controllers/userratings.controller');

router.get('/userratings', UserRatingsControllers.getAll);
router.get('/userratings/:id', UserRatingsControllers.getRatingById);
router.post('/userratings', UserRatingsControllers.create);
router.put('/userratings/:id', UserRatingsControllers.updateRating);
router.delete('/userratings/:id', UserRatingsControllers.removeRating);

module.exports = router;