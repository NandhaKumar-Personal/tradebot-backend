import { readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Endpoint } from "../app/utils/Endpoint/endpoint.js";
import {
  aesDecryptMiddleware,
  aesEncryptMiddleware,
} from "../app/utils/AES/aes_middleware.js";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loadRoutes = async (app) => {
  const aesKey = crypto.randomBytes(32).toString("base64");
  console.log("AES key:", aesKey);

  const endpointsDir = join(__dirname, "../app/endpoints");

  const entries = readdirSync(endpointsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const modulePath = join(endpointsDir, entry.name, "index.js");

      const fileURL = `file://${modulePath.replace(/\\/g, "/")}`;

      try {
        const { default: moduleRoutes } = await import(fileURL);

        moduleRoutes.forEach((endpoint) => {
          const middlewares = [
            // Conditionally add AES decryption middleware
            ...(process.env.ENABLE_AES === "true"
              ? [aesDecryptMiddleware]
              : []),
            ...endpoint.middleware, // Custom middleware
            ...endpoint.validator, // Validation middleware
            endpoint.authType === "jwt" ? Endpoint.jwtMiddleware : undefined,
            ...(endpoint.authType === "api_key"
              ? [Endpoint.apiKeyMiddleware]
              : []), // Conditionally add API key middleware
          ].filter(Boolean); // Remove undefined entries

          // Conditionally add AES encryption middleware
          if (process.env.ENABLE_AES === "true") {
            app[endpoint.method](
              endpoint.path,
              ...middlewares, // Apply all middlewares
              aesEncryptMiddleware, // Apply AES encryption middleware
              async (req, res, next) => {
                try {
                  await endpoint.handler(req, res); // Execute endpoint handler
                } catch (err) {
                  next(err); // Forward errors to the error handling middleware
                }
              },
              ...endpoint.errorMiddleware // Apply any error handling middleware
            );
          } else {
            app[endpoint.method](
              endpoint.path,
              ...middlewares, // Apply all middlewares without AES
              async (req, res, next) => {
                try {
                  await endpoint.handler(req, res); // Execute endpoint handler
                } catch (err) {
                  next(err); // Forward errors to the error handling middleware
                }
              },
              ...endpoint.errorMiddleware // Apply any error handling middleware
            );
          }
        });

        console.log(`Loaded routes for module: ${entry.name}`);
      } catch (err) {
        console.error(
          `Failed to load routes for module: ${entry.name}`,
          err.message
        );
      }
    }
  }
};

export default loadRoutes;
