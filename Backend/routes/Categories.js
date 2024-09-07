// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET /api/categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({}); // Fetch all categories
        res.json(categories.map(category => category.name)); // Return an array of category names
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
