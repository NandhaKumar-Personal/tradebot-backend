import { readdirSync } from "fs";
import { join } from "path";
import { sequelize } from "../sequelize";
const db = {};

readdirSync(__dirname)
  .filter((file) => file.endsWith(".js") && file !== "index.js")
  .forEach((file) => {
    const model = require(join(__dirname, file))(
      sequelize,
      sequelize.Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

export default db;
