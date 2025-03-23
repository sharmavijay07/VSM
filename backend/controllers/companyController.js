const Company = require('../models/companyModel');

exports.createCompany = async (req, res) => {
    const { name, stockPrice } = req.body;
    const company = new Company({ name, stockPrice });
    await company.save();
    res.json({ message: "Company created" });
};

exports.getAllCompanies = async (req, res) => {
    const companies = await Company.find();
    res.json(companies);
};
