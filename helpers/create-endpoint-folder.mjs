// helpers/create-endpoint.mjs

import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const endpointName = args[0];

if (!endpointName) {
  console.log("Please provide an endpoint name");
  process.exit(1);
}

const endpointDir = path.join("app", "endpoints", endpointName);

// Check if the directory already exists
if (fs.existsSync(endpointDir)) {
  console.log(`Endpoint "${endpointName}" already exists.`);
  process.exit(1);
}

// Create the directory structure
fs.mkdirSync(endpointDir, { recursive: true });

// Files to create
const files = [
  `${endpointName}.validator.js`,
  `${endpointName}.handler.js`,
  `${endpointName}.middleware.js`,
  `${endpointName}.routes.js`,
  `${endpointName}.swagger.yaml`,
  "index.js",
];

// Create the files
files.forEach((file) => {
  fs.writeFileSync(
    path.join(endpointDir, file),
    `// ${file} for ${endpointName} endpoint`
  );
});

console.log(`Endpoint "${endpointName}" created successfully.`);
