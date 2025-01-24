const createModuleLogger = require("../../utils/createModuleLogger");
const logger = createModuleLogger("user");

exports.getUser = (req, res) => {
  logger.info("Fetching all users"); // Log specific to the user module
  res.json({ message: "Fetch all users" });
};

exports.createUser = (req, res) => {
  logger.info("Creating a new user with data:", req.body); // Log specific to the user module
  res.json({ message: "User created successfully", data: req.body });
};
