// File: app/endpoints/user/user.routes.js
const express = require("express");
const { getUser, createUser } = require("./user.handler");
const { validateUser } = require("./user.validator");
const { authenticate } = require("./user.middleware");
const createModuleLogger = require("../../utils/createModuleLogger");

const userLogger = createModuleLogger("user");

const router = express.Router();

router.use((req, res, next) => {
  userLogger.info("Request received", {
    ip: req.ip,
    method: req.method,
    path: req.originalUrl,
  });
  next();
});

// Define routes
router.get("/okuser", (req, res) => {
  userLogger.info("Accessed /okuser endpoint", { ip: req.ip });
  res.json({ message: "Docs available at /docs" });
});

router.get("/", authenticate, (req, res) => {
  userLogger.info("Fetched user data", { ip: req.ip });
  getUser(req, res);
});

router.post("/", authenticate, validateUser, (req, res) => {
  userLogger.info("Creating user", { ip: req.ip });
  createUser(req, res);
});

module.exports = router;
