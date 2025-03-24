const Portfolio = require('../models/portfolioModel');
const Share = require('../models/ShareModel');
const TransactionHistory = require('../models/transactionHistoryModel');

exports.buyOrSellShares = async (req, res) => {
    const { customerId, companyId, operation, shares } = req.body;
    const subAdminId = req.user.userId; // Get the subadmin ID from the authenticated user

    try {
        const share = await Share.findById(companyId);
        if (!share) {
            return res.status(404).json({ message: "Company not found" });
        }

        let portfolio = await Portfolio.findOne({ customerId });
        if (!portfolio) {
            // Create a new portfolio if it doesn't exist
            portfolio = new Portfolio({
                customerId,
                companies: []
            });
        }

        let existingCompany = portfolio.companies.find(c => c.companyId.toString() === companyId);

        if (operation === 'buy') {
            
            // Check if there are enough shares available
            if (share.quantity < shares) {
                return res.status(400).json({ message: "Not enough shares available" });
            }

            // Update portfolio
            if (existingCompany) {
                existingCompany.sharesOwned += parseInt(shares);
            } else {
                portfolio.companies.push({ 
                    companyId, 
                    sharesOwned: parseInt(shares) 
                });
            }

            // Update share quantity
            share.quantity -= parseInt(shares);
        } else if (operation === 'sell') {
            // Check if customer owns enough shares
            if (!existingCompany || existingCompany.sharesOwned < shares) {
                return res.status(400).json({ message: "Not enough shares owned" });
            }

            // Update portfolio
            existingCompany.sharesOwned -= parseInt(shares);
            if (existingCompany.sharesOwned === 0) {
                portfolio.companies = portfolio.companies.filter(
                    c => c.companyId.toString() !== companyId
                );
            }

            // Update share quantity
            share.quantity += parseInt(shares);
        } else {
            return res.status(400).json({ message: "Invalid operation" });
        }


        console.log("hey i am herer")

        // Create transaction history record
        const transaction = new TransactionHistory({
            customerId,
            companyId,
            subAdminId,
            transactionType: operation,
            quantity: shares,
            shareValue: share.shareValue,
            totalValue: share.shareValue * shares
        });
        await transaction.save().then(() => console.log("Transaction saved!")).catch(err => console.error("Transaction save error:", err));
        await portfolio.save().then(() => console.log("Portfolio saved!")).catch(err => console.error("Portfolio save error:", err));
        await share.save().then(() => console.log("Share updated!")).catch(err => console.error("Share update error:", err));
        
        console.log("Transaction successful", transaction)
        res.json({ message: "Transaction successful" });
    } catch (error) {
        console.error("Transaction error:", error);
        res.status(500).json({ message: "Transaction failed", error: error.message });
    }
};

// Get transaction history for a specific customer
exports.getCustomerTransactionHistory = async (req, res) => {
    try {
        const { customerId } = req.params;
        
        const transactions = await TransactionHistory.find({ customerId })
            .populate('companyId', 'companyName shareValue')
            .populate('subAdminId', 'email')
            .sort({ timestamp: -1 });
        console.log("transaction",transactions)
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transaction history", error: error.message });
    }
};

// Get transaction history for a subadmin (all transactions they've processed)
exports.getSubAdminTransactionHistory = async (req, res) => {
    try {
        const subAdminId = req.user.userId;
        
        const transactions = await TransactionHistory.find({ subAdminId })
            .populate('customerId', 'email')
            .populate('companyId', 'companyName shareValue')
            .sort({ timestamp: -1 });
            
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transaction history", error: error.message });
    }
};

// Get all transactions (for superadmin)
exports.getAllTransactionHistory = async (req, res) => {
    try {
        const transactions = await TransactionHistory.find()
            .populate('customerId', 'email')
            .populate('companyId', 'companyName shareValue')
            .populate('subAdminId', 'email')
            .sort({ timestamp: -1 });
            
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transaction history", error: error.message });
    }
};
