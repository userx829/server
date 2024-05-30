// middleware/auth.js
const jwt = require("jsonwebtoken");
const jwtSecret = "Encryption is the key";

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if token does not exist
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);

    // Add user from payload to the request object
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
