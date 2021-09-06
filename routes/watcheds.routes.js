var express = require('express');
var router = express.Router();
 
const watchedControllers = require('../controllers/watched.controllers');

router.get('/watched', watchedControllers.getAll);
router.get('/watched/:id', watchedControllers.getSingleWatched);
router.get('/watched/user/:id', watchedControllers.getWatchedByUserId);
router.post('/watched', watchedControllers.create);
router.put('/watched/:id', watchedControllers.updateWatched);
router.delete('/watched/:id', watchedControllers.removeSingleWatched);  

module.exports = router;   