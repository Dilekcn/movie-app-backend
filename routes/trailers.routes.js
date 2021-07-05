var express = require('express');
var router = express.Router();

const trailersControllers = require('../controllers/trailers.controllers');

router.get('/trailers', trailersControllers.getAll);
router.get('/trailers/:id', trailersControllers.getSingleTrailer);
router.get('/trailers/userid/:id', trailersControllers.getTrailersByUserId);
router.post('/trailers', trailersControllers.create);
router.put('/trailers/:id', trailersControllers.updateSingleTrailer);
router.delete('/trailers/:id', trailersControllers.removeSingleTrailer);

module.exports = router;
