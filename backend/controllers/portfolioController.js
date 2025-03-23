const Portfolio = require('../models/portfolioModel');
const User = require('../models/userModel');

exports.getPortfolio = async (req, res) => {
    const portfolio = await Portfolio.findOne({ userId: req.user.userId }).populate('companyShares.companyId');
    if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
    }

    res.json(portfolio);
};
