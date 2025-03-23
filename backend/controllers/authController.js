const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Create and save the new user
        const user = new User({ username, email, password, role });
        await user.save();

        // Generate a token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return the token and user details
        res.status(201).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && user.password === password) {
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } else {
        res.status(400).json({ message: "Invalid credentials" });
    }
};
