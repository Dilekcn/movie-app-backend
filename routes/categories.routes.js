var express = require('express');
var router = express.Router();

const categoriesControllers = require('../controllers/categories.controller');

router.get('/categories', categoriesControllers.getAll);
router.get('/categories/:id', categoriesControllers.getSingleCategory);
router.post('/categories', categoriesControllers.create);
router.put('/categories/:id', categoriesControllers.updateSingleCategory);
router.delete('/categories/:id', categoriesControllers.removeSingleCategory);

module.exports = router;
