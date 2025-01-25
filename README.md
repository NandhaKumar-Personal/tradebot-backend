# TradeBot Application Backend - Node.# Project Overview

This project is a Node.js application designed with a modular structure to enable scalability and maintainability. It uses `express` as the web framework and `winston` for advanced logging.

---

## Project Structure

### Root Directory

- **`app.js`**: Main entry point for the application. Initializes the server, global middleware, and dynamically loads module routes.
- **`.env`**: Environment configuration file.
- **`package.json`**: Project dependencies and scripts.
- **`logs/`**: Directory where log files are stored.

---

### `app/` Directory

#### **`config/`**

- **`swagger.js`**: Configuration for Swagger API documentation.

#### **`middlewares/`**

- **`globalLogger.js`**: Implements global logging for requests and errors using `winston`.

#### **`endpoints/`**

Contains all API modules, each with its own structure:

**Example: `user/`**

- **`user.routes.js`**: Defines routes for the user module.
- **`user.handler.js`**: Contains business logic for handling user-related requests.
- **`user.validator.js`**: Validation logic for user data.
- **`user.middleware.js`**: Middleware specific to the user module.
- **`user.swagger.yaml`**: swagger yaml specific to the user module.

Other modules (e.g., `role/`) follow the same structure.

---

### `routes/`

- **`index.js`**: Dynamically loads all modules from the `app/endpoints` directory and attaches them to the Express app. Modules are exposed with the `/api/<module-name>` prefix.

---

### `utils/`

- **`createModuleLogger.js`**: Factory function to create `winston` loggers for individual modules. Logs are written to both the console (if the module is active in `LOG_MODULE`) and to specific log files.

---

## Logging System

### Global Logging

- Implemented in `middlewares/globalLogger.js`.
- Logs all incoming requests and global errors.
- Writes logs to `logs/global.log`.

### Module-Specific Logging

- Implemented using `createModuleLogger.js`.
- Each module has a separate log file under `logs/` (e.g., `logs/user.log`, `logs/role.log`).
- Console logs are controlled via the `LOG_MODULE` environment variable.
  - Example: `LOG_MODULE=user,role` enables console logs only for the `user` and `role` modules.

---

## How to Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:

   ```
   PORT=3000
   LOG_MODULE=user,role
   ```

3. Start the server:

   ```bash
   npm run start
   ```

4. Access the application:
   ```
   http://localhost:3000
   ```

---

## API Documentation

API documentation is available at `/docs` (Swagger).

---

## Example API Endpoints

- **GET /api/user/okuser**: Simple endpoint to check user module functionality.
- **GET /api/user**: Fetch user data (requires authentication).
- **POST /api/user**: Create a new user (requires authentication and validation).

---

## Notes

- Ensure the `logs/` directory exists for proper logging.
- Update the `LOG_MODULE` environment variable to control console logs for specific modules.

## Sequelize

Make Migration

```plaintext
npx sequelize-cli migration:generate --name users
```

Run Migration

```plaintext
npx sequelize-cli db:migrate
```

Make Seeder

```plaintext
npx sequelize-cli seed:generate --name users
```

Run Seeder

```plaintext
npx sequelize-cli db:seed:all
```

Sedeer One Run

```plaintext
npx sequelize-cli db:seed --seed 20240825024126-roles.js
```

```plaintext
npx sequelize-cli db:seed --seed 20240824062807-users.js
```

Make Model and Migration

```plaintext
npx sequelize-cli model:generate --name users --attributes name:string,email:string,password:string,role:string
```

# Make JWT Secret

```plaintext
node generate-secret.js
```

## Frontend

[Starter Kit Frontend React JS](https://github.com/SyahrulRomadoni/reactjs-vite-starter-kit)

## Library

- express
- jsonwebtoken
- bcryptjs
- dotenv
- sequelize
- sequelize-cli
- mysql2 or pg and pg-hstore for connection to MySQL or PostgreSQL.
- CORS
