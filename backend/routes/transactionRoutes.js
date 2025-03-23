const express = require('express');
const { buyOrSellShares } = require('../controllers/transactionController');
const checkRole = require('../middleware/checkRole');
const router = express.Router();

router.post('/', checkRole('subadmin'), buyOrSellShares);

module.exports = router;
