var express = require('express');
var router = express.Router();

const RatingsControllers = require('../controllers/ratings.controller');

router.get('/ratings', RatingsControllers.getAll);
router.get('/ratings/:id', RatingsControllers.getRatingById);
router.post('/ratings', RatingsControllers.create);
router.put('/ratings/:id', RatingsControllers.updateRating);
router.delete('/ratings/:id', RatingsControllers.removeRating);

module.exports = router;