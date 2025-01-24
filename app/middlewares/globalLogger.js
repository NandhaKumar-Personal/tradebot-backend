// File: app/middlewares/globalLogger.js
const winston = require("winston");
const path = require("path");

const globalLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const metaDetails = Object.keys(meta)
        .map((key) => `${key}: ${JSON.stringify(meta[key])}`)
        .join(", ");
      return `[${timestamp}] [GLOBAL] [${level.toUpperCase()}]: ${message} ${
        metaDetails ? `| ${metaDetails}` : ""
      }`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaDetails = Object.keys(meta)
            .map((key) => `${key}: ${JSON.stringify(meta[key])}`)
            .join(", ");
          return `[${timestamp}] [GLOBAL] [${level.toUpperCase()}]: ${message} ${
            metaDetails ? `| ${metaDetails}` : ""
          }`;
        })
      ),
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/global.log"),
    }),
  ],
});

// Middleware to log request and response details
const requestResponseLogger = (req, res, next) => {
  const startTime = Date.now();

  // Hook into the response `finish` event to capture status code and timing
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    globalLogger.info("Request handled", {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      ip: req.ip,
      responseTime: `${duration}ms`,
    });
  });

  next();
};

module.exports = {
  globalLogger,
  requestResponseLogger,
};
