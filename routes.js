const express = require("express");
const fs = require("fs");
const path = require("path");

function loadModules(app) {
  const modulesPath = path.join(__dirname, "app", "endpoints");

  fs.readdirSync(modulesPath).forEach((module) => {
    const moduleIndex = path.join(modulesPath, module, "index.js");
    if (fs.existsSync(moduleIndex)) {
      const routes = require(moduleIndex);
      app.use(`/api/${module}`, routes);
    }
  });
}

module.exports = loadModules;
