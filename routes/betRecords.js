const express = require('express');
const BetRecord = require('../models/BetRecord'); // Import the BetRecord model

const router = express.Router();

// Create a new bet record
router.post('/bet-records', async (req, res) => {
    const { user_id, bet_amount, multiplier, box_number, cashout_amount, gameType } = req.body;

    try {
        const newBetRecord = new BetRecord({
            user_id,
            bet_amount,
            cashout_amount,
            gameType,
            createdAt: new Date() // Automatically set the creation date
        });

        if (gameType === 'aviatorGame') {
            newBetRecord.multiplier = multiplier;
        } else if (gameType === 'colorGame') {
            newBetRecord.box_number = box_number;
        }

        await newBetRecord.save();
        res.status(201).json(newBetRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all bet records for a user with optional filtering by gameType
router.get('/bet-records/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { gameType } = req.query;

    try {
        const query = { user_id };
        if (gameType) {
            query.gameType = gameType;
        }

        const betRecords = await BetRecord.find(query).sort({ createdAt: -1 });
        res.status(200).json(betRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
