import {
  createLogger,
  format as _format,
  transports as _transports,
} from "winston";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const createModuleLogger = (moduleName) => {
  const logFilePath = join(__dirname, "../../logs", `${moduleName}.log`);
  const isActiveModule =
    process.env.LOG_MODULE &&
    process.env.LOG_MODULE.split(",").includes(moduleName);

  const logger = createLogger({
    level: "info",
    format: _format.combine(
      _format.timestamp(),
      _format.printf(({ timestamp, level, message, ...meta }) => {
        const metaDetails = Object.keys(meta)
          .map((key) => `${key}: ${meta[key]}`)
          .join(", ");
        return `[${timestamp}] [${moduleName.toUpperCase()}] [${level.toUpperCase()}]: ${message} ${
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
              .map((key) => `${key}: ${meta[key]}`)
              .join(", ");
            return `[${timestamp}] [${moduleName.toUpperCase()}] [${level.toUpperCase()}]: ${message} ${
              metaDetails ? `| ${metaDetails}` : ""
            }`;
          })
        ),
        silent: !isActiveModule,
      }),
      new _transports.File({
        filename: logFilePath,
      }),
    ],
  });

  return logger;
};

export default createModuleLogger;
