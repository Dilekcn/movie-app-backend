var express = require('express');
var router = express.Router();
 
const likedControllers = require('../controllers/liked.controller');

router.get('/liked', likedControllers.getAll);
router.get('/liked/:id', likedControllers.getSingleLiked);
router.get('/liked/user/:id', likedControllers.getLikedByUserId);
router.post('/liked', likedControllers.create);
router.put('/liked/:id', likedControllers.updateLiked);
router.delete('/liked/:id', likedControllers.removeSingleLiked);

module.exports = router;   