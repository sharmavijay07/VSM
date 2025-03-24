const Share = require('../models/ShareModel');
const SharePriceHistory = require('../models/sharePriceHistoryModel');

// Update share price and record history
exports.updateSharePrice = async (req, res) => {
    const { id } = req.params;
    const { action, value } = req.body;
    const userId = req.user.userId;

    try {
        const share = await Share.findById(id);
        if (!share) {
            return res.status(404).json({ message: "Company not found" });
        }

        const oldPrice = share.shareValue;

        if (action === 'increase') {
            share.shareValue += parseFloat(value);
        } else if (action === 'decrease') {
            if (share.shareValue <= parseFloat(value)) {
                return res.status(400).json({ message: "Share value cannot be negative" });
            }
            share.shareValue -= parseFloat(value);
        } else {
            return res.status(400).json({ message: "Invalid action" });
        }

        // Record price history
        const priceHistory = new SharePriceHistory({
            companyId: id,
            price: share.shareValue,
            modifiedBy: userId
        });

        await priceHistory.save();
        await share.save();

        res.json({ 
            share,
            priceChange: {
                oldPrice,
                newPrice: share.shareValue,
                change: share.shareValue - oldPrice
            }
        });
    } catch (error) {
        console.error("Error updating share price:", error);
        res.status(500).json({ message: "Failed to update share price", error: error.message });
    }
};

// Get price history for a company
exports.getSharePriceHistory = async (req, res) => {
    const { companyId } = req.params;

    try {
        const priceHistory = await SharePriceHistory.find({ companyId })
            .sort({ timestamp: 1 })
            .limit(30); // Limit to last 30 price changes
            
        res.json(priceHistory);
    } catch (error) {
        res.status(500).json({ message: "Error fetching price history", error: error.message });
    }
};
