require("dotenv").config(); // Load environment variables from .env

module.exports = {
  development: {
    username: process.env.DB_USERNAME_DEV || "root",
    password: process.env.DB_PASSWORD_DEV || null,
    database: process.env.DB_NAME_DEV || "database_development",
    host: process.env.DB_HOST_DEV || "127.0.0.1",
    dialect: process.env.DB_DIALECT_DEV || "mysql",
    // logging: console.log, // Enable logging in development
    logging: false, // Disable logging in development
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME_TEST || "database_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false, // Disable logging in tests
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false, // Disable logging in production
    dialectOptions: {
      ssl: {
        require: true, // Enable SSL for secure connections
        rejectUnauthorized: false,
      },
    },
  },
};
