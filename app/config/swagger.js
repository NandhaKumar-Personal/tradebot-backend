const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TradeBot API",
      version: "1.0.0",
      description: "API documentation for the TradeBot Application Backend",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Indicate the format is JWT
        },
      },
    },
    security: [
      {
        BearerAuth: [], // Apply BearerAuth globally to all endpoints by default
      },
    ],
  },
  // Include all YAML files in the swagger folder
  apis: [path.resolve(__dirname, "../swagger/*.yaml")],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
