import sequelize from "sequelize";

import { db } from "../db/db.js";

export const classFileModel = db.define(
  "classFile",
  {
    id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize.STRING },
    description: { type: sequelize.STRING },
    type: {
      type: sequelize.ENUM,
      values: ["AUDIO", "VIDEO", "IMAGE", "URL"],
    },
    filePath: { type: sequelize.STRING },
    fileUrl: { type: sequelize.STRING },
    uploadedAt: {
      type: sequelize.DATE,
      defaultValue: sequelize.NOW,
    },
    uploadedBy: {
      type: sequelize.INTEGER,
      model: "tutor",
      key: "id",
    },
    classroomId: {
      type: sequelize.INTEGER,
      model: "classroom",
      key: "id",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        fields: ["name"],
      },
      {
        fields: ["type"],
      },
    ],
  }
);
