import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug"; // Use SequelizeStorage
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { development, test, production } from "./config/config.js"; // Named imports

// Get __dirname equivalent in ES modules

const environment = process.env.NODE_ENV || "development";
const dbConfig = { development, test, production }[environment]; // Dynamically select environment config
const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: console.log, // Optional: Customize logging (use `false` to disable logging)
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1); // Exit process if connection fails
  }
};

// Function to check for pending migrations
const checkPendingMigrations = async () => {
  try {
    const umzug = new Umzug({
      migrations: {
        glob: resolve(__dirname, "../migrations/*.js"), // Path to migration files
      },
      storage: new SequelizeStorage({ sequelize }),
      context: sequelize.getQueryInterface(),
      logger: console,
    });

    const pendingMigrations = await umzug.pending();
    if (pendingMigrations.length > 0) {
      console.log(`Found ${pendingMigrations.length} pending migrations:`);
      pendingMigrations.forEach((migration) => {
        console.log(`- ${migration.name}`);
      });
      return true; // Indicate that there are pending migrations
    } else {
      console.log("No pending migrations.");
      return false; // Indicate that no migrations are pending
    }
  } catch (error) {
    console.error("Error checking pending migrations:", error);
    throw error;
  }
};

// Function to run pending migrations
const runPendingMigrations = async () => {
  try {
    const umzug = new Umzug({
      migrations: {
        glob: resolve(__dirname, "./migrations/*.js"), // Path to migration files
      },
      storage: new SequelizeStorage({ sequelize }),
      context: sequelize.getQueryInterface(),
      logger: console,
    });

    // Get pending migrations
    const pendingMigrations = await umzug.pending();
    if (pendingMigrations.length > 0) {
      console.log(`Running ${pendingMigrations.length} pending migrations...`);
      await umzug.up(); // Run all pending migrations
      console.log("All pending migrations executed successfully.");
    } else {
      console.log("No pending migrations found.");
    }
  } catch (error) {
    console.error("Failed to run pending migrations:", error);
    throw error;
  }
};

export default {
  sequelize,
  testConnection,
  checkPendingMigrations,
  runPendingMigrations,
};
