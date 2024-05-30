const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 }, // Add points field with default value of 0
});

module.exports = mongoose.model("User", userSchema);

// previous code
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   // username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   // phoneNumber: { type: String, required: true, unique: true }, // New field for phone number
//   name: { type: String, required: true },
//   password: { type: String, required: true },
//   // isVerified: { type: Boolean, default: false }, // Field to track email verification status
//   // verificationCode: { type: String } // Field to store the verification code
// });

// module.exports = mongoose.model("User", userSchema);
