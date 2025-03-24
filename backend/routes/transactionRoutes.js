const express = require('express');
const { 
    buyOrSellShares, 
    getCustomerTransactionHistory, 
    getSubAdminTransactionHistory,
    getAllTransactionHistory
} = require('../controllers/transactionController');
const checkRole = require('../middleware/checkRole');
const router = express.Router();

// Transaction operations
router.post('/', checkRole('subadmin'), buyOrSellShares);

// Transaction history routes
router.get('/history/customer/:customerId', getCustomerTransactionHistory);
router.get('/history/subadmin', checkRole('subadmin'), getSubAdminTransactionHistory);
router.get('/history/all', checkRole('superadmin'), getAllTransactionHistory);

module.exports = router;
