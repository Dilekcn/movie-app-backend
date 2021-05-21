const express = require('express');
const router = express.Router();

const faqControllers = require('../controllers/faqs.controllers');

router.get('/faqs', faqControllers.getAllFaqs);
router.get('/faqs/:faqid', faqControllers.getSingleFaqById);
router.get('/faqs/question/:question', faqControllers.getSingleFaqByQuestion);
router.get('/faqs/answer/:answer', faqControllers.getSingleFaqByAnswer);
router.post('/faqs', faqControllers.createFaq);
router.put('/faqs/:faqid', faqControllers.updateFaq);

module.exports = router;
