// File: app/utils/createModuleLogger.js
const winston = require("winston");
const path = require("path");

const createModuleLogger = (moduleName) => {
  const logFilePath = path.join(__dirname, "../../logs", `${moduleName}.log`);

  // Determine if the module is active for console logging
  const isActiveModule =
    process.env.LOG_MODULE &&
    process.env.LOG_MODULE.split(",").includes(moduleName);

  const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaDetails = Object.keys(meta)
          .map((key) => `${key}: ${meta[key]}`)
          .join(", ");
        return `[${timestamp}] [${moduleName.toUpperCase()}] [${level.toUpperCase()}]: ${message} ${
          metaDetails ? `| ${metaDetails}` : ""
        }`;
      })
    ),
    transports: [
      // Console transport: logs only for active modules
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const metaDetails = Object.keys(meta)
              .map((key) => `${key}: ${meta[key]}`)
              .join(", ");
            return `[${timestamp}] [${moduleName.toUpperCase()}] [${level.toUpperCase()}]: ${message} ${
              metaDetails ? `| ${metaDetails}` : ""
            }`;
          })
        ),
        silent: !isActiveModule, // Only log to console if the module is active
      }),
      // File transport: logs all messages regardless of module activation
      new winston.transports.File({
        filename: logFilePath,
      }),
    ],
  });

  return logger;
};

module.exports = createModuleLogger;
