const express = require('express');
const router = express.Router();

const faqControllers = require('../controllers/faqs.controllers');

router.get('/faqs', faqControllers.getAllFaqs);

module.exports = router;
