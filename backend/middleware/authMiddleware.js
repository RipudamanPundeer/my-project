const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization"); // Get token from headers

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET); // Verify token
    req.user = await User.findById(decoded.id).select("-password"); // Attach user info to request
    next(); // Proceed to next middleware/route
  } catch (error) {
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

module.exports = authMiddleware;
