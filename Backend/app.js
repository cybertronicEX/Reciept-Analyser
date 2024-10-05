const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chargesRoutes = require('./routes/Charges');
const aiapiRoutes = require('./routes/Aiapi');
const categoryRoutes = require('./routes/Categories');

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
// const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://receiptAnalyzerAdmin:fuckyou123@receiptanalyzer.31xam.mongodb.net/?retryWrites=true&w=majority&appName=ReceiptAnalyzer', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// Routes
app.use('/api/charges', chargesRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ai', aiapiRoutes);
 


module.exports = app;
