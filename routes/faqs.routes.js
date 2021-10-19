const express = require('express');
const router = express.Router();

const faqControllers = require('../controllers/faqs.controllers');

router.get('/faqs', faqControllers.getAllFaqs);
router.get('/faqs/:id', faqControllers.getSingleFaqById);
router.post('/faqs', faqControllers.createFaq);
router.put('/faqs/:id', faqControllers.updateFaq);
router.delete('/faqs/:id', faqControllers.removeFaq);

module.exports = router;
