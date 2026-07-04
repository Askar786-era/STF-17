const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const inventoryItemSchema = new mongoose.Schema({
    bloodGroup: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    units: { type: Number, default: 0, min: 0 },
    available: { type: Boolean, default: true }
}, { _id: false });

const bloodBankSchema = new mongoose.Schema({
    bankName:  { type: String, required: true },
    district:  { type: String, required: true, index: true },
    state:     { type: String, required: true, index: true },
    phone:     { type: String, required: true },
    address:   { type: String, default: '' },
    password:  { type: String, required: true },
    inventory: { type: [inventoryItemSchema], default: [] },
    createdAt: { type: Date, default: Date.now }
});

bloodBankSchema.index({ district: 1, state: 1 });

// Hash password before saving
bloodBankSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

module.exports = mongoose.model('BloodBank', bloodBankSchema);
