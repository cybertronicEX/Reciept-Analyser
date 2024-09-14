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

// DELETE all charges (Purge all)
router.delete('/purge', async (req, res) => {
    try {
        await Charge.deleteMany(); // Deletes all documents in the charges collection
        res.json({ message: 'All charges purged' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE a specific charge by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedCharge = await Charge.findByIdAndDelete(req.params.id); // Updated deletion method
        if (!deletedCharge) {
            return res.status(404).json({ message: 'Charge not found' });
        }
        res.json({ message: 'Charge deleted' });
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
        time,
        qty
    });

    try {
        const savedCharge = await newCharge.save();
        res.status(201).json(savedCharge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// POST multiple charges
router.post('/bulk', async (req, res) => {
    const charges = req.body; 

    try {
        if (!Array.isArray(charges)) {
            return res.status(400).json({ message: 'Invalid input format. Expected an array of records.' });
        }
        const savedCharges = await Charge.insertMany(charges);
        res.status(201).json(savedCharges);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
