var express = require('express');
var router = express.Router();

const commentsControllers = require('../controllers/comments.controllers');
 
router.get("/comments",commentsControllers.getAll)
router.get("/comments/:id",commentsControllers.getSingleComment)
router.get("/comments/userid/:userId",commentsControllers.getCommentsByUserId)
router.get("/comments/videoid/:videoId",commentsControllers.getCommentsByVideoId)
router.post("/comments",commentsControllers.create)
router.put("/comments/:id", commentsControllers.updateComment)
router.delete("/comments/:id", commentsControllers.removeSingleComment)

module.exports = router; 