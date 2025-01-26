// middlewares/authMiddleware.js
import { verify } from "jsonwebtoken";

// JWT Authentication Middleware
const jwtAuth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
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

export default { jwtAuth, staticAuth };
