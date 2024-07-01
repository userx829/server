const mongoose = require('mongoose');

const BetRecordSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    bet_amount: {
        type: Number,
        required: true
    },
    multiplier: {
        type: Number,
        required: false // Make this field optional
    },
    box_number: {
        type: Number,
        required: false // Make this field optional
    },
    cashout_amount: {
        type: Number,
        required: true
    },
    gameType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BetRecord', BetRecordSchema);
