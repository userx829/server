const mongoose = require('mongoose');

const betRecordSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bet_amount: { type: Number, required: true },
  multiplier: { type: Number, required: true },
  cashout_amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BetRecord', betRecordSchema);
