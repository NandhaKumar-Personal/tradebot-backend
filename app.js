import express, { json, static as serveStatic } from "express";
import { config } from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { join } from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath
import { dirname } from "path"; // Import dirname
import loadEndpoints from "./routes.js";
import setupSwagger from "./app/config/swagger.js";
import sequelizeModule from "./app/db/sequelize.js";
import globalLoggerModule from "./app/middlewares/globalLogger.js";
import loadRoutes from "./routes/index.js";
import { Endpoint } from "./app/utils/Endpoint/endpoint.js";

const { sequelize, checkPendingMigrations, runPendingMigrations } =
  sequelizeModule;
const { globalLogger, requestResponseLogger } = globalLoggerModule;

config();

// Set up __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(json());
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
      // loadEndpoints(app);
      loadRoutes(app);

      // Error handling
      app.use(Endpoint.createErrorHandler());

      // Health check route
      app.get("/health", (req, res) => {
        res.status(200).json({ status: "OK", uptime: process.uptime() });
      });

      // Setup Swagger
      setupSwagger(app);

      // Static file serving
      app.use(serveStatic(join(__dirname, "public"))); // Updated with new __dirname

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
