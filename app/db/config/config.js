import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env

// Configuration for different environments
export const development = {
  username: process.env.DB_USERNAME_DEV || "root",
  password: process.env.DB_PASSWORD_DEV || null,
  database: process.env.DB_NAME_DEV || "tradebot",
  host: process.env.DB_HOST_DEV || "localhost",
  dialect: process.env.DB_DIALECT_DEV || "mysql",
  logging: false, // Disable logging in development
};

export const test = {
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME_TEST || "database_test",
  host: process.env.DB_HOST || "127.0.0.1",
  dialect: process.env.DB_DIALECT || "mysql",
  logging: false, // Disable logging in tests
};

export const production = {
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
};
