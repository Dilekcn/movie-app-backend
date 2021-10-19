var express = require('express');
var router = express.Router();
 
const watchedControllers = require('../controllers/watched.controllers');

router.get('/watched', watchedControllers.getAll);
router.get('/watched/:id', watchedControllers.getSingleWatched);
router.get('/watched/user/:id', watchedControllers.getWatchedByUserId);
router.post('/watched', watchedControllers.create);
router.post('/watched/filter', watchedControllers.getWithQuery);


module.exports = router;   