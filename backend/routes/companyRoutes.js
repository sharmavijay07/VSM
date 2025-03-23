const express = require('express');
const { createCompany, getAllCompanies } = require('../controllers/companyController');
const checkRole = require('../middleware/checkRole');
const router = express.Router();

router.post('/', checkRole('superadmin'), createCompany);
router.get('/', checkRole('superadmin'), getAllCompanies);

module.exports = router;
