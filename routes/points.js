const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const fetchuserdetails = require("../middleware/fetchuserdetails.js");

// Add points endpoint
router.post("/update-points", fetchuserdetails, async (req, res) => {
  const { pointsToAdd } = req.body;
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.points += pointsToAdd;
    await user.save();

    res.json({ msg: "Points added successfully", points: user.points });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
