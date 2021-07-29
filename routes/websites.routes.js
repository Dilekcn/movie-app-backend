var express = require('express');
var router = express.Router();

const websiteControllers = require('../controllers/website.controllers');

router.get('/websites', websiteControllers.getAll);
router.get('/websites/:id', websiteControllers.getSingleWebsite);
router.post('/websites', websiteControllers.create);
router.put('/websites/:id', websiteControllers.updateSingleWebsite);
router.delete('/websites/:id', websiteControllers.removeSingleWebsite);

module.exports = router;
