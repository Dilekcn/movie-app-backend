var express = require('express');
var router = express.Router();

const listsControllers = require('../controllers/lists.controllers');

router.get('/lists', listsControllers.getAll);
router.get('/lists/populars', listsControllers.getPopular);
router.get('/lists/:id', listsControllers.getSingleList);
router.get('/lists/userid/:id', listsControllers.getListByUserId);
router.post('/lists', listsControllers.create);
router.post('/lists/search', listsControllers.searchWithName);
router.put('/lists/:id', listsControllers.updateList); 
router.put('/lists/removemovies/:id', listsControllers.removeMovieFromList);
router.delete('/lists/:id', listsControllers.removeSingleList);    

module.exports = router;    
   