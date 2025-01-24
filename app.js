// File: app.js (main server file)
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const loadModules = require("./routes");
const setupSwagger = require("./app/config/swagger");
const {
  globalLogger,
  requestResponseLogger,
} = require("./app/middlewares/globalLogger");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Log server startup
globalLogger.info("Server is starting...");

// Apply global request/response logger
app.use(requestResponseLogger);

// Dynamically load all module routes
loadModules(app);

// Setup Swagger
setupSwagger(app);

// Global error handler
app.use((err, req, res, next) => {
  globalLogger.error("Unhandled error occurred", {
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
  });
  res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  globalLogger.info("Server is running", { url: `http://localhost:${PORT}` });
});
