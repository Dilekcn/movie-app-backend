var express = require('express');
var router = express.Router();

const watchControllers = require('../controllers/watch.controllers');

router.get('/watch', watchControllers.getAll);
router.get('/watch/:id', watchControllers.getSingleWatch);
router.post('/watch', watchControllers.create);
router.put('/watch/:id', watchControllers.updateSingleWatch);
router.delete('/watch/:id', watchControllers.removeSingleWatch);

module.exports = router;
