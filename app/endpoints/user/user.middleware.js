import createModuleLogger from "../../utils/createModuleLogger";
const logger = createModuleLogger("user");

export function authenticate(req, res, next) {
  logger.info("Authenticating user for path: " + req.originalUrl);
  const token = req.headers.authorization;
  if (!token) {
    logger.error("Authentication failed: Missing token");
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Example token validation logic
  logger.info("User authenticated successfully");
  next();
}
