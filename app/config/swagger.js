const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const path = require("path");

// Load YAML Swagger files dynamically from modules
const getSwaggerDocs = () => {
  const modulesPath = path.join(__dirname, "../endpoints");
  const swaggerFiles = fs.readdirSync(modulesPath).flatMap((module) => {
    const filePath = path.join(modulesPath, module, `${module}.swagger.yaml`);
    return fs.existsSync(filePath) ? filePath : [];
  });

  const specs = swaggerFiles.map((file) => {
    return require("yamljs").load(file);
  });

  return {
    openapi: "3.0.0",
    info: {
      title: "TradeBot API",
      version: "1.0.0",
    },
    paths: Object.assign({}, ...specs.map((spec) => spec.paths)),
    components: Object.assign(
      {},
      ...specs.map((spec) => spec.components || {})
    ),
  };
};

const swaggerSpec = swaggerJSDoc({
  definition: getSwaggerDocs(),
  apis: [],
});

const setupSwagger = (app) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
