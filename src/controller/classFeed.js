import { failureResponseModel, successResponseModel } from "../common.js";
import { classFileModel } from "../model/classFileModel.js";
import { classroomStudentModel, classroomModel } from "../model/classroomModel.js";
import { Op } from "sequelize";
import { STUDENT, TUTOR } from "../constants.js";

export const getAllClasses = async (req, res) => {
  try {
    const ROLE = req.role;
    const USERID = req.userId;

    let classroomData = [];

    if (ROLE === STUDENT) {
      classroomData = await classroomStudentModel.findAll({
        where: {
          studentId: {
            [Op.eq]: USERID,
          },
        },
      });
    } else if (ROLE === TUTOR) {
      classroomData = await classroomModel.findAll({
        where: {
          tutorId: {
            [Op.eq]: USERID,
          },
        },
      });
    }

    return res.status(200).json(successResponseModel("files searched successfully", { classroomData }));
  } catch (error) {
    console.log(error);
    res.status(404).json(failureResponseModel("files searching failed", { message: error }));
  }
};

export const getAllClassesFiles = async (req, res) => {
  try {
    const { classroomId } = req.params;

    if (!classroomId) {
      throw new Error("classroomId is missing");
    }

    const fileSearchData = await classFileModel.findAll({
      attributes: ["id", "name", "description", "type", "filePath", "uploadedAt", "uploadedBy", "classroomId"],
      where: {
        classroomId: {
          [Op.eq]: classroomId,
        },
      },
    });

    return res.status(200).json(successResponseModel("files searched successfully", { fileSearchData }));
  } catch (error) {
    console.log(error);
    res.status(404).json(failureResponseModel("files searching failed", { message: error }));
  }
};

export const fileSearch = async (req, res) => {
  try {
    const { classroomId, query, fileType } = req.body;

    if (!classroomId) {
      throw new Error("classroomId is missing");
    }

    const searchArray = [
      {
        classroomId: {
          [Op.eq]: classroomId,
        },
      },
    ];

    if (query) {
      searchArray.push({
        name: {
          [Op.substring]: query || "",
        },
      });
    }

    if (fileType) {
      searchArray.push({
        type: {
          [Op.eq]: fileType,
        },
      });
    }

    if (searchArray.length === 1) {
      return res.status(200).json(successResponseModel("Either query or fileType is needed"));
    }

    const fileSearchData = await classFileModel.findAll({
      where: {
        [Op.and]: searchArray,
      },
    });

    return res.status(200).json(successResponseModel("file searched successfully", { fileSearchData }));
  } catch (error) {
    console.log(error);
    res.status(404).json(failureResponseModel("file searching failed", { message: error }));
  }
};
