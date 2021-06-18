const express = require('express');
const router = express.Router();

const moviesControllers = require('../controllers/movies.controllers')

router.get('/movies', moviesControllers.getAll)
router.get('/movies/:movieid', moviesControllers.getSingleMovie)
router.get('/movies/byname/:name', moviesControllers.getSingleMovieByName)
router.post('/movies', moviesControllers.create)
router.put('/movies/:movieid', moviesControllers.updateSingleMovie)
router.delete('/movies/:movieid', moviesControllers.removeSingleMovie)


module.exports = router 