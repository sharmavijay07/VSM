const mongoose = require('mongoose');

const transactionHistorySchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Share',
    required: true
  },
  subAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionType: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  shareValue: {
    type: Number,
    required: true
  },
  totalValue: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TransactionHistory', transactionHistorySchema);
