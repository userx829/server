const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 }, // Add points field with default value of 0
});

module.exports = mongoose.model("User", userSchema);
