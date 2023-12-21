import sequelize from "sequelize";

import { db } from "../db/db.js";

export const studentModel = db.define(
  "student",
  {
    id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize.STRING },
  },
  { freezeTableName: true, timestamps: true }
);
