const Portfolio = require('../models/portfolioModel');
const Company = require('../models/companyModel');

exports.buyOrSellShares = async (req, res) => {
    const { customerId, companyId, operation, shares } = req.body;

    const portfolio = await Portfolio.findOne({ userId: customerId });
    if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
    }

    const company = await Company.findById(companyId);
    if (!company) {
        return res.status(404).json({ message: "Company not found" });
    }

    let companyShares = portfolio.companyShares.find(c => c.companyId.toString() === companyId);
    if (!companyShares) {
        companyShares = { companyId, shares: 0 };
        portfolio.companyShares.push(companyShares);
    }

    if (operation === 'buy') {
        companyShares.shares += shares;
    } else if (operation === 'sell' && companyShares.shares >= shares) {
        companyShares.shares -= shares;
    } else {
        return res.status(400).json({ message: "Insufficient shares" });
    }

    await portfolio.save();
    res.json({ message: "Transaction successful" });
};
