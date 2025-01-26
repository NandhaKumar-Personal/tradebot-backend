import {
  createLogger,
  format as _format,
  transports as _transports,
} from "winston";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

const globalLogger = createLogger({
  level: "info",
  format: _format.combine(
    _format.timestamp(),
    _format.printf(({ timestamp, level, message, ...meta }) => {
      const metaDetails = Object.keys(meta)
        .map((key) => `${key}: ${JSON.stringify(meta[key])}`)
        .join(", ");
      return `[${timestamp}] [GLOBAL] [${level.toUpperCase()}]: ${message} ${
        metaDetails ? `| ${metaDetails}` : ""
      }`;
    })
  ),
  transports: [
    new _transports.Console({
      format: _format.combine(
        _format.colorize(),
        _format.printf(({ timestamp, level, message, ...meta }) => {
          const metaDetails = Object.keys(meta)
            .map((key) => `${key}: ${JSON.stringify(meta[key])}`)
            .join(", ");
          return `[${timestamp}] [GLOBAL] [${level.toUpperCase()}]: ${message} ${
            metaDetails ? `| ${metaDetails}` : ""
          }`;
        })
      ),
    }),
    new _transports.File({
      filename: join(__dirname, "../../logs/global.log"),
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

export default {
  globalLogger,
  requestResponseLogger,
};
