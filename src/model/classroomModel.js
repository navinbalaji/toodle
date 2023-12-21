import sequelize from "sequelize";

import { db } from "../db/db.js";

export const classroomModel = db.define(
  "classroom",
  {
    id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize.STRING },
    tutorId: {
      type: sequelize.INTEGER,
      model: "tutorId",
      key: "id",
    },
  },
  { freezeTableName: true, timestamps: true }
);

export const classroomStudentModel = db.define(
  "classroomStudent",
  {
    classroomId: {
      type: sequelize.INTEGER,
      model: "classroom",
      key: "id",
    },
    studentId: {
      type: sequelize.INTEGER,
      model: "student",
      key: "id",
    },
  },
  { freezeTableName: true, timestamps: true }
);
