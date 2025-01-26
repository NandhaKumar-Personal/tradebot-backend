import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";
import { resolve } from "path";

// Initialize Sequelize using your configuration
const config =
  require("../config/config")[process.env.NODE_ENV || "development"];
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

const runPendingMigrations = async () => {
  try {
    const umzug = new Umzug({
      migrations: {
        glob: resolve(__dirname, "../migrations/*.js"), // Path to migration files
      },
      storage: new SequelizeStorage({ sequelize }),
      context: sequelize.getQueryInterface(),
      logger: console,
    });

    // Log pending migrations
    const pendingMigrations = await umzug.pending();
    if (pendingMigrations.length > 0) {
      console.log(`Running ${pendingMigrations.length} pending migrations...`);
      await umzug.up(); // Run all pending migrations
      console.log("All pending migrations have been successfully executed.");
    } else {
      console.log("No pending migrations found.");
    }
  } catch (error) {
    console.error("Failed to run pending migrations:", error);
    throw error;
  }
};

export default { runPendingMigrations };
