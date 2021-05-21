const express = require('express');
const router = express.Router();

const faqControllers = require('../controllers/faqs.controllers');

router.get('/faqs', faqControllers.getAllFaqs);
router.get('/faqs/:faqid', faqControllers.getSingleFaqById);
router.get('/faqs/question/:question', faqControllers.getSingleFaqByQuestion);
router.post('/faqs', faqControllers.createFaq);

module.exports = router;
