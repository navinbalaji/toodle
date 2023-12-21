import sequelize from "sequelize";

import { db } from "../db/db.js";

export const tutorModel = db.define(
  "tutor",
  {
    id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize.STRING },
  },
  { freezeTableName: true, timestamps: true }
);

