const express = require('express');
const Share = require('../models/ShareModel');
const Portfolio = require('../models/portfolioModel');
const TransactionHistory = require('../models/transactionHistoryModel');
const router = express.Router();

// Buy shares for a customer
router.post('/buy-shares/:subAdminId', async (req, res) => {
    const { customerId, companyId, quantity } = req.body;
    const subAdminId = req.params.subAdminId; // Assuming authentication middleware

    try {
        const share = await Share.findById(companyId);
        if (!share) return res.status(404).json({ message: "Company not found" });

        if (share.quantity < quantity) {
            return res.status(400).json({ message: "Not enough shares available" });
        }

        let portfolio = await Portfolio.findOne({ customerId });
        if (!portfolio) {
            portfolio = new Portfolio({ customerId, companies: [] });
        }

        let existingCompany = portfolio.companies.find(c => c.companyId.toString() === companyId);
        if (existingCompany) {
            existingCompany.sharesOwned += quantity;
        } else {
            portfolio.companies.push({ companyId, sharesOwned: quantity });
        }

        share.quantity -= quantity;

        // Save transaction
        const transaction = new TransactionHistory({
            customerId,
            companyId,
            subAdminId,
            transactionType: "buy",
            quantity,
            shareValue: share.shareValue,
            totalValue: share.shareValue * quantity
        });

        await Promise.all([transaction.save(), portfolio.save(), share.save()]);

        console.log("Transaction saved for buying shares:", transaction);
        res.json({ message: "Shares bought successfully", transaction });
    } catch (error) {
        console.error("Error in buying shares:", error);
        res.status(500).json({ message: "Transaction failed", error: error.message });
    }
});

// Sell shares for a customer
router.post('/sell-shares/:subAdminId', async (req, res) => {
    const { customerId, companyId, quantity } = req.body;
    const subAdminId = req.params.subAdminId; // Assuming authentication middleware

    try {
        const share = await Share.findById(companyId);
        if (!share) return res.status(404).json({ message: "Company not found" });

        const portfolio = await Portfolio.findOne({ customerId });
        if (!portfolio) return res.status(400).json({ message: "No shares owned" });

        let existingCompany = portfolio.companies.find(c => c.companyId.toString() === companyId);
        if (!existingCompany || existingCompany.sharesOwned < quantity) {
            return res.status(400).json({ message: "Not enough shares owned" });
        }

        existingCompany.sharesOwned -= quantity;
        if (existingCompany.sharesOwned === 0) {
            portfolio.companies = portfolio.companies.filter(c => c.companyId.toString() !== companyId);
        }

        share.quantity += quantity;

        // Save transaction
        const transaction = new TransactionHistory({
            customerId,
            companyId,
            subAdminId,
            transactionType: "sell",
            quantity,
            shareValue: share.shareValue,
            totalValue: share.shareValue * quantity
        });

        await Promise.all([transaction.save(), portfolio.save(), share.save()]);

        console.log("Transaction saved for selling shares:", transaction);
        res.json({ message: "Shares sold successfully", transaction });
    } catch (error) {
        console.error("Error in selling shares:", error);
        res.status(500).json({ message: "Transaction failed", error: error.message });
    }
});

module.exports = router;
