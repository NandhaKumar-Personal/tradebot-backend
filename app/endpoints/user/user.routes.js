import { Router } from "express";
import createModuleLogger from "../../utils/createModuleLogger.js";
const logger = createModuleLogger("user");

const router = Router();

// Test route
router.get("/test", (req, res) => {
  logger.info("Test route accessed");
  res.json({ message: "Test route is working!" });
});

export default router;
