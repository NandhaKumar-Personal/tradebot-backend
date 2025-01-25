const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const loadModules = require("./routes");
const setupSwagger = require("./app/config/swagger");
const {
  sequelize,
  checkPendingMigrations,
  runPendingMigrations,
} = require("./app/db/sequelize");
const {
  globalLogger,
  requestResponseLogger,
} = require("./app/middlewares/globalLogger");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Log server startup
globalLogger.info("Server is starting...");

// Check if there are pending migrations
checkPendingMigrations()
  .then(async (hasPendingMigrations) => {
    if (hasPendingMigrations) {
      await runPendingMigrations(); // Run migrations if any are pending
    }

    // Test DB connection after migrations
    try {
      await sequelize.authenticate();
      globalLogger.info(
        "Database connection has been established successfully."
      );

      // Apply global request/response logger
      app.use(requestResponseLogger);

      // Dynamically load all module routes
      loadModules(app);

      // Health check route
      app.get("/health", (req, res) => {
        res.status(200).json({ status: "OK", uptime: process.uptime() });
      });

      // Setup Swagger
      setupSwagger(app);

      // Static file serving
      app.use(express.static(path.join(__dirname, "public")));

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

      // Graceful shutdown
      process.on("SIGINT", async () => {
        globalLogger.info("Shutting down server...");
        try {
          await sequelize.close();
          globalLogger.info("Database connection closed.");
          process.exit(0);
        } catch (err) {
          globalLogger.error("Error closing database connection:", err);
          process.exit(1);
        }
      });

      // Start the server
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        globalLogger.info("Server is running", {
          url: `http://localhost:${PORT}`,
        });
      });
    } catch (err) {
      globalLogger.error("Unable to connect to the database:", err);
      process.exit(1);
    }
  })
  .catch((err) => {
    globalLogger.error("Failed to check migrations:", err);
    process.exit(1);
  });
