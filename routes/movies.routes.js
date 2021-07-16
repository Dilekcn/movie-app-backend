var express = require('express');
var router = express.Router();

const moviesControllers = require('../controllers/movies.controllers');

router.get('/movies', moviesControllers.getAll);
router.get('/movies/:id', moviesControllers.getSingleTrailer);
router.get('/movies/userid/:id', moviesControllers.getTrailersByUserId);
router.post('/movies', moviesControllers.create);
router.put('/movies/:id', moviesControllers.updateSingleTrailer);
router.delete('/movies/:id', moviesControllers.removeSingleTrailer);

module.exports = router;
