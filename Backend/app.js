const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chargesRoutes = require('./routes/charges');
const categoryRoutes = require('./routes/Categories');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://receiptAnalyzerAdmin:admin123@receiptanalyzer.31xam.mongodb.net/?retryWrites=true&w=majority&appName=ReceiptAnalyzer', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// Routes
app.use('/api/charges', chargesRoutes);
app.use('/api/categories', categoryRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
