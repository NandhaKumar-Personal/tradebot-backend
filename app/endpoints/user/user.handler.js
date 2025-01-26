import createModuleLogger from "../../utils/createModuleLogger.js";
const logger = createModuleLogger("user");

export function getUser(req, res) {
  logger.info("Fetching all users"); // Log specific to the user module
  res.json({ message: "Fetch all users" });
}

export function createUser(req, res) {
  logger.info("Creating a new user with data:", req.body); // Log specific to the user module
  res.json({ message: "User created successfully", data: req.body });
}
