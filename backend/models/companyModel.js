const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: String,
    stockPrice: Number,
});

module.exports = mongoose.model('Company', companySchema);
