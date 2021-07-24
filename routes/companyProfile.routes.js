const express = require('express');
const router = express.Router();
const CompanyProfileControllers = require('../controllers/companyProfile.controllers');

router.get('/companyprofile', CompanyProfileControllers.getAll);
router.get('/companyprofile/:id', CompanyProfileControllers.getCompanyProfileById);
router.post('/companyprofile', CompanyProfileControllers.createCompanyProfile);
router.put('/companyprofile/:id', CompanyProfileControllers.updateCompanyProfile);
router.delete('/companyprofile/:id', CompanyProfileControllers.removeCompanyProfile);

module.exports = router;
