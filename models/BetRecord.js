const mongoose = require('mongoose');

const betRecordSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    period: { type: Date, required: true, default: Date.now },
    bet_amount: { type: Number, required: true },
    multiplier: { type: Number, required: true },
    cashout_amount: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});

const BetRecord = mongoose.model('BetRecord', betRecordSchema);

module.exports = BetRecord;
