const mongoose = require('mongoose');

const chargeSchema = new mongoose.Schema({
    charges: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    payee: { type: String, required: true },
    payment_type: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    receipt_id: { type: String, required: true },
    receipt_ref_no: { type: String, required: true },
});

module.exports = mongoose.model('charges', chargeSchema);
