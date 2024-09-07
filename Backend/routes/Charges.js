const express = require('express');
const router = express.Router();
const Charge = require('../models/Charge');

// GET all charges
router.get('/', async (req, res) => {
    try {
        const charges = await Charge.find();
        res.json(charges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new charge
router.post('/', async (req, res) => {
    const { charges, amount, category, payee, payment_type, date, time } = req.body;
    const newCharge = new Charge({
        charges,
        amount,
        category,
        payee,
        payment_type,
        date,
        time
    });

    try {
        const savedCharge = await newCharge.save();
        res.status(201).json(savedCharge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
