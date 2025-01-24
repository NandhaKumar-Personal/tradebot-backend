const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./app/config/swagger");
const dotenv = require("dotenv");
const cors = require("cors"); // Import CORS for cross-origin resource sharing
const userRoutes = require("./app/routes/userRoutes");
const morgan = require("morgan"); // Import Morgan for HTTP request logging
const logger = require("./app/utils/logger"); // Custom logger

dotenv.config(); // Load environment variables from .env file

const app = express();

// Enable CORS for all routes
app.use(cors());

// Optional: Use specific CORS options
// const corsOptions = {
//   origin: 'http://localhost:3000', // Replace with the allowed domain
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };
// app.use(cors(corsOptions));

// Parse incoming JSON requests
app.use(express.json());

// Define API routes
app.use("/api/users", userRoutes);

// Swagger documentation routes
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Middleware for logging HTTP requests
app.use(
  morgan("combined", {
    stream: logger.stream, // Use custom logger for storing logs
  })
);

// Root route for a simple response
app.get("/", (req, res) => {
  logger.info("Root endpoint accessed");
  res.send("Trade Bot Application API");
});

// Start the server
const APP_PORT = process.env.APP_PORT || 3000; // Default to port 3000 if not set
const APP_URL = process.env.APP_URL || "//localhost:"; // Default URL
app.listen(APP_PORT, () => {
  console.log(`Server is running at ${APP_URL}:${APP_PORT}`);
});
