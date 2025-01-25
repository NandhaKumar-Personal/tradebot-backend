// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

// JWT Authentication Middleware
const jwtAuth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Static Key Authentication Middleware
const staticAuth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey === process.env.STATIC_API_KEY) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
};

module.exports = { jwtAuth, staticAuth };
