const express = require('express');
const { getPortfolio } = require('../controllers/portfolioController');
const Portfolio = require('../models/portfolioModel')
const checkRole = require('../middleware/checkRole');
const router = express.Router();

router.get('/', checkRole('customer'), getPortfolio);
// Get customer portfolio
router.get('/:customerId', async (req, res) => {
    const { customerId } = req.params;

    try {
        const portfolio = await Portfolio.findOne({ customerId }).populate('companies.companyId');
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        const portfolioDetails = portfolio.companies.map((company) => {
            const share = company.companyId;
            return {
                companyName: share.companyName,
                shareValue: share.shareValue,
                sharesOwned: company.sharesOwned,
                totalValue: company.sharesOwned * share.shareValue,
            };
        });

        const totalPortfolioValue = portfolioDetails.reduce((acc, curr) => acc + curr.totalValue, 0);

        res.json({ portfolio: portfolioDetails, totalPortfolioValue });
    } catch (err) {
        res.status(400).json({ message: 'Error fetching portfolio' });
    }
});


module.exports = router;
