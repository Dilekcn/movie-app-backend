const express = require('express');
const router = express.Router();

const contactInfoControllers = require('../controllers/contactinfo.controllers');

router('/contactinfo', contactInfoControllers.getAllContactInfo);

module.exports = router;
