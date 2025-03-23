const express = require('express');
const Share = require('../models/ShareModel');
const User = require('../models/userModel');
const router = express.Router();

// Get all customers and subadmins
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ['customer', 'subadmin'] } });
        res.json(users);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching users' });
    }
});

// Get all companies
router.get('/companies', async (req, res) => {
    try {
        const companies = await Share.find(); // Fetch all companies from the Share model
        res.json(companies);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching companies' });
    }
});


// Add new company
router.post('/companies', async (req, res) => {
    const { companyName, shareValue, quantity } = req.body;
    try {
        const newShare = new Share({ companyName, shareValue, quantity });
        await newShare.save();
        res.status(201).json(newShare);
    } catch (err) {
        res.status(400).json({ message: 'Error adding company' });
    }
});

// Delete a company
router.delete('/companies/:id', async (req, res) => {
    try {
        await Share.findByIdAndDelete(req.params.id);
        res.json({ message: 'Company deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting company' });
    }
});

// Update share value (increase or decrease)
router.patch('/companies/:id', async (req, res) => {
    const { action, value } = req.body; // action could be 'increase' or 'decrease'
    try {
        const company = await Share.findById(req.params.id);
        if (action === 'increase') {
            company.shareValue += value;
        } else if (action === 'decrease') {
            company.shareValue -= value;
        }
        await company.save();
        res.json(company);
    } catch (err) {
        res.status(400).json({ message: 'Error updating company share value' });
    }
});

module.exports = router;
