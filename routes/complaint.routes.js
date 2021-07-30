var express = require('express');
var router = express.Router();

const ComplaintControllers = require('../controllers/complaint.controller');

router.get('/complaint', ComplaintControllers.getAll);
router.get('/complaint/commnetId', ComplaintControllers.getSingleList);
// router.get('/complaint/userid/:userid', ComplaintControllers.getListByUserId);
router.post('/complaint', ComplaintControllers.create);
// router.put('/complaint/:id', ComplaintControllers.updateList);
// router.delete('/complaint/:id', ComplaintControllers.removeSingleList);

module.exports = router;
