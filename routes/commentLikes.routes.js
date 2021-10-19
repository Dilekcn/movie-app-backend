var express = require('express');
var router = express.Router();
 
const commentLikesControllers = require('../controllers/commentLikes.controllers');

router.get('/commentlikes', commentLikesControllers.getAll);
router.get('/commentlikes/:id', commentLikesControllers.getSingleCommentLike);
router.get('/commentlikes/user/:id', commentLikesControllers.getCommentLikesByUserId);
router.get('/commentlikes/comment/:id', commentLikesControllers.getCommentLikesByCommentId);
router.post('/commentlikes', commentLikesControllers.create);
router.post('/commentlikes/filter', commentLikesControllers.getWithQuery);

module.exports = router;      