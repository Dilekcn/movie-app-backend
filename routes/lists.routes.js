var express = require('express');
var router = express.Router();

const listsControllers = require('../controllers/lists.controllers');

router.get('/lists', listsControllers.getAll);
router.get('/lists/:id', listsControllers.getSingleList);
router.get('/lists/userid/:userid', listsControllers.getListByUserId);
router.post('/lists', listsControllers.create);
router.put('/lists/:id', listsControllers.updateList);
router.delete('/lists/:id', listsControllers.removeSingleList);

module.exports = router;
