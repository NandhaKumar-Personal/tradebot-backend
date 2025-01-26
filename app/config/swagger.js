import { readdirSync, existsSync, readFileSync } from "fs";
import path, { join, dirname } from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import { serve, setup } from "swagger-ui-express";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load YAML Swagger files dynamically from modules
const loadYaml = (file) => {
  try {
    const content = readFileSync(file, "utf8");
    return yaml.load(content);
  } catch (err) {
    console.error(`Error loading YAML file: ${file}`, err);
    throw err;
  }
};

const getSwaggerDocs = async () => {
  const modulesPath = join(__dirname, "../endpoints");
  const swaggerFiles = readdirSync(modulesPath).flatMap((module) => {
    const filePath = join(modulesPath, module, `${module}.swagger.yaml`);
    return existsSync(filePath) ? filePath : [];
  });

  try {
    const specs = await Promise.all(swaggerFiles.map((file) => loadYaml(file)));

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
  } catch (err) {
    console.error("Error loading Swagger docs:", err);
    throw err;
  }
};

const setupSwagger = (app) => {
  getSwaggerDocs()
    .then((swaggerDocs) => {
      app.use("/docs", serve, setup(swaggerDocs));
      console.log("Swagger UI is available at /docs");
    })
    .catch((err) => {
      console.error("Error setting up Swagger:", err);
    });
};

export default setupSwagger;
