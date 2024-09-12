const mongoose = require('mongoose');

const chargeSchema = new mongoose.Schema({
    charges: { type: String, required: false },
    amount: { type: Number, required: false },
    qty: { type: Number, required: false },
    category: { type: String, required: false },
    payee: { type: String, required: false },
    payment_type: { type: String, required: false },
    date: { type: String, required: false },
    time: { type: String, required: false },
    receipt_id: { type: String, required: false },
    receipt_ref_no: { type: String, required: false },
    qty: { type: Number, required: false }
});

module.exports = mongoose.model('charges', chargeSchema);
