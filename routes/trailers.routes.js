var express = require('express');
var router = express.Router();

const trailersControllers = require('../controllers/trailers.controllers');

router.get('/trailers', trailersControllers.getAll); 
router.get('/trailers/:id', trailersControllers.getSingleTrailer);
router.post('/trailers', trailersControllers.create);
router.post('/trailers/search', trailersControllers.searchWithTitle);
router.put('/trailers/:id', trailersControllers.updateSingleTrailer);
router.delete('/trailers/:id', trailersControllers.removeSingleTrailer);

module.exports = router;  
 