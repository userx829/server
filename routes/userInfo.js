//userInfo.js
const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const fetchuserdetails = require("../middleware/fetchuserdetails.js");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pointsRouter = require("./points");
const jwtSecret = "Encryption is the key";
const fetch = require("node-fetch");
const rapidAPIKey = "515bc52577mshbb64717462aefcbp176e7djsnde0c71a5434e";
router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Enter a proper name").isLength({ min: 5 }),
    body("password", "Use a proper password").isLength({ min: 5 }),
    // COMMENTED OUT PHONE NUMBER VALIDATION
    // body("phoneNumber", "Enter a valid phone number").isMobilePhone("any", {
    //   strictMode: false,
    // }), // Add validation for phone number
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, password, phoneNumber } = req.body;

    try {
      // Check if the user already exists with the provided email
      const existingUserWithEmail = await User.findOne({ email });

      if (existingUserWithEmail) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email is already registered" }] });
      }

      // Generate a verification code
      // const verificationCode = Math.floor(
      //   100000 + Math.random() * 900000
      // ).toString();

      // Make a request to send SMS verification
      // const url = "https://wipple-sms-verify-otp.p.rapidapi.com/send";
      // const options = {
      //   method: "POST",
      //   headers: {
      //     "content-type": "application/json",
      //     "X-RapidAPI-Key": rapidAPIKey,
      //     "X-RapidAPI-Host": "wipple-sms-verify-otp.p.rapidapi.com",
      //   },
      //   body: JSON.stringify({
      //     app_name: "exampleapp",
      //     code_length: 6,
      //     code_type: "number",
      //     expiration_second: 86000,
      //     // COMMENTED OUT PHONE NUMBER
      //     // phone_number: phoneNumber, // Use the provided phone number
      //   }),
      // };

      // const response = await fetch(url, options);
      // const result = await response.text();
      // console.log(result);

      // Hash the password
      const salt = await bcrypt.genSaltSync(10);
      const hash = await bcrypt.hashSync(password, salt);

      // Create a new user instance
      const user = new User({
        email,
        name,
        password: hash,
        // COMMENTED OUT PHONE NUMBER
        // phoneNumber, // Save the phone number
        // verificationCode, // Save the verification code
      });

      // Save the user to the database
      await user.save();

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

// Login endpoint

router.post(
  "/login",
  [
    body("email", "Enter valid email").isEmail(),
    body("password", "Password must be at least 5 characters long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // Generate JWT token
      const payload = {
        user: {
          id: user._id,
        },
      };
      jwt.sign(payload, jwtSecret, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.get("/profile", fetchuserdetails, async (req, res) => {
  try {
    // Fetch user details from the database using the user ID from the JWT payload
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from the response

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return user details
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.use("/points", pointsRouter);

module.exports = router;
