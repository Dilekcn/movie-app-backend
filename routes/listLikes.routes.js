var express = require('express');
var router = express.Router();
 
const listLikesControllers = require('../controllers/listLikes.controller');

router.get('/listlikes', listLikesControllers.getAll);
router.get('/listlikes/:id', listLikesControllers.getSingleListLike);
router.get('/listlikes/user/:id', listLikesControllers.getListLikesByUserId);
router.get('/listlikes/list/:id', listLikesControllers.getListLikesByListId);
router.post('/listlikes', listLikesControllers.create);
router.post('/listlikes/filter', listLikesControllers.getWithQuery);


module.exports = router;     