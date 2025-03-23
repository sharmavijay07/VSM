const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes')
const subAdminRoutes = require('./routes/subAdminRoutes')

dotenv.config();

const app = express();
app.use(cors({
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Allowed headers
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Use Routes
app.use('/auth', authRoutes);
app.use('/company', companyRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/transaction', transactionRoutes);
app.use('/superadmin',superAdminRoutes)
app.use('/subadmin',subAdminRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
