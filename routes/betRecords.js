const express = require('express');
const BetRecord = require('../models/BetRecord'); // Import the BetRecord model

const router = express.Router();

// Create a new bet record
router.post('/bet-records', async (req, res) => {
    const { user_id, bet_amount, multiplier, cashout_amount } = req.body;

    try {
        const newBetRecord = new BetRecord({
            user_id,
            bet_amount,
            multiplier,
            cashout_amount
        });
        await newBetRecord.save();
        res.status(201).json(newBetRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all bet records for a user
router.get('/bet-records/:user_id', async (req, res) => {
    const user_id = req.params.user_id;

    try {
        const betRecords = await BetRecord.find({ user_id }).sort({ created_at: -1 });
        res.status(200).json(betRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
