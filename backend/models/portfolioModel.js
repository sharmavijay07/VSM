const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    companies: [
        {
            companyId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Share',
                required: true,
            },
            sharesOwned: {
                type: Number,
                required: true,
            },
        },
    ],
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
