var express = require('express');
var router = express.Router();

const ComplaintControllers = require('../controllers/complaint.controller');

router.get('/complaint', ComplaintControllers.getAll);
router.get('/complaint/:id', ComplaintControllers.getSingleComplaint);
router.post('/complaint', ComplaintControllers.create);
router.put('/complaint/:id', ComplaintControllers.updateComplaint);
router.delete('/complaint/:id', ComplaintControllers.removeComplaint);

module.exports = router;
 