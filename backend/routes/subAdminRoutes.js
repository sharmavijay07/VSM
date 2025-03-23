const express = require('express');
const Share = require('../models/ShareModel');
const User = require('../models/userModel');
const Portfolio = require('../models/portfolioModel');
const router = express.Router();

// Buy shares for a customer
router.post('/buy-shares', async (req, res) => {
    const { customerId, companyId, quantity } = req.body;

    try {
        const share = await Share.findById(companyId);
        const portfolio = await Portfolio.findOne({ customerId });

        // Check if the customer already has shares in this company
        if (portfolio) {
            const existingCompany = portfolio.companies.find(
                (company) => company.companyId.toString() === companyId
            );
            if (existingCompany) {
                existingCompany.sharesOwned += quantity;
            } else {
                portfolio.companies.push({ companyId, sharesOwned: quantity });
            }
        } else {
            const newPortfolio = new Portfolio({
                customerId,
                companies: [{ companyId, sharesOwned: quantity }],
            });
            await newPortfolio.save();
        }

        // Update the share quantity in the company
        share.quantity -= quantity;
        await share.save();

        await portfolio.save();
        res.json({ message: 'Shares bought successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error buying shares' });
    }
});

// Sell shares for a customer
router.post('/sell-shares', async (req, res) => {
    const { customerId, companyId, quantity } = req.body;

    try {
        const share = await Share.findById(companyId);
        const portfolio = await Portfolio.findOne({ customerId });

        // Check if the customer owns enough shares
        const existingCompany = portfolio.companies.find(
            (company) => company.companyId.toString() === companyId
        );
        if (!existingCompany || existingCompany.sharesOwned < quantity) {
            return res.status(400).json({ message: 'Not enough shares to sell' });
        }

        existingCompany.sharesOwned -= quantity;
        if (existingCompany.sharesOwned === 0) {
            portfolio.companies = portfolio.companies.filter(
                (company) => company.companyId.toString() !== companyId
            );
        }

        // Update the share quantity in the company
        share.quantity += quantity;
        await share.save();

        await portfolio.save();
        res.json({ message: 'Shares sold successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error selling shares' });
    }
});

module.exports = router;
