import { readdirSync, existsSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

export default async function loadEndpoints(app) {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  const modulesPath = resolve(__dirname, "app", "endpoints");

  if (existsSync(modulesPath)) {
    console.log(`Loading endpoints from: ${modulesPath}`);
    const modules = readdirSync(modulesPath, { withFileTypes: true });

    for (const module of modules) {
      if (module.isDirectory()) {
        const moduleIndex = resolve(modulesPath, module.name, "index.js");
        if (existsSync(moduleIndex)) {
          try {
            const normalizedPath = moduleIndex.replace(/\\/g, "/");
            const moduleURL = new URL(`file://${normalizedPath}`);
            const routes = await import(moduleURL.href);
            app.use(`/api/${module.name}`, routes.default);
            console.log(`Loaded routes for module: /api/${module.name}`);
          } catch (error) {
            console.error(`Failed to load routes for module: ${module.name}`);
            console.error(error);
          }
        } else {
          console.warn(`No index.js found in module directory: ${module.name}`);
        }
      }
    }
  } else {
    console.error(
      `The "endpoints" directory does not exist at path: ${modulesPath}`
    );
  }
}
