import { failureResponseModel, successResponseModel } from "../common.js";
import { tutorModel } from "../model/tutorModel.js";
import { classroomModel, classroomStudentModel } from "../model/classroomModel.js";
import { classFileModel } from "../model/classFileModel.js";
import { db } from "../db/db.js";
import { fileUpload } from "../utils/multer.js";
import fs from "fs";

export const createTutor = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new Error("name is missing");
    }

    const tutorData = await tutorModel.create({ name });

    return res.status(200).json(successResponseModel("tutor created successfully", { tutorData }));
  } catch (error) {
    console.log(error);
    res.status(404).json(failureResponseModel("tutor creation failed", { message: error }));
  }
};

export const addClassroom = async (req, res) => {
  try {
    const { name, studentIds } = req.body;

    if (!name || !studentIds || !studentIds?.length === 0) {
      throw new Error("Somefields are missing");
    }

    const classroomData = await db.transaction(async (t) => {
      const result = await classroomModel.create({ name, tutorId: req.userId }, { transaction: t });
      await classroomStudentModel.bulkCreate(
        studentIds.map((studentId) => ({ classroomId: result.id, studentId })),
        { transaction: t }
      );

      return result;
    });

    return res.status(200).json(successResponseModel("classroom created successfully", { classroomData }));
  } catch (error) {
    console.log(error);
    res.status(404).json(failureResponseModel("classroom creation failed", { message: error }));
  }
};

export const updateClassroom = async (req, res) => {
  try {
    const { name, classroomId } = req.body;

    if (!name) {
      throw new Error("name is missing");
    }
    const updatedClassroom = await classroomModel.update(
      { name },
      {
        where: {
          id: classroomId,
          tutorId: req.userId,
        },
      }
    );

    return res.status(200).json(successResponseModel("classroom updated successfully", { updatedClassroom }));
  } catch (error) {
    console.log(error);
    res.status(404).json(failureResponseModel("classroom updation failed", { message: error }));
  }
};

export const deleteClassroom = async (req, res) => {
  try {
    const { classroomId } = req.body;

    if (!classroomId) {
      throw new Error("classroomId is missing");
    }

    const classroomDeletedData = await db.transaction(async (t) => {
      await classroomModel.destroy(
        {
          where: {
            id: classroomId,
            tutorId: req.userId,
          },
        },
        { transaction: t }
      );
      await classroomStudentModel.destroy(
        {
          where: {
            classroomId,
          },
        },
        { transaction: t }
      );
    });

    return res.status(200).json(successResponseModel("classroom deleted successfully", { classroomDeletedData }));
  } catch (error) {
    console.log(error);
    res.status(404).json(failureResponseModel("classroom deletion failed", { message: error }));
  }
};

export const uploadFile = async (req, res) => {
  try {
    const filePath = await uploadClassFile(req);

    if (!req.file) {
      throw new Error("no file");
    }

    const domainBaseUrl = process.env.DOMAIN_BASE_URL;

    if (!domainBaseUrl) {
      throw new Error("domain base url is not configured");
    }

    const { name, description, type, classroomId } = req.body;

    if (!name || !description || !type || !classroomId) {
      throw new Error("Somefields are missing");
    }

    if (!filePath) {
      throw new Error("Something went wrong while uploading file");
    }

    const fileUrl = domainBaseUrl + "/" + filePath;

    const uploadClassFileReturn = await classFileModel.create({
      name,
      description,
      type,
      filePath,
      fileUrl,
      uploadedBy: req.userId,
      classroomId,
    });

    res
      .status(200)
      .json(successResponseModel("class file uploaded successfully", { uploadClassFileReturn: uploadClassFileReturn }));
  } catch (error) {
    console.log(error);
    res.status(404).json(failureResponseModel("class file upload failed", { message: error }));
  }
};

export const updateFileName = async (req, res) => {
  try {
    const { name, classFileId } = req.body;

    if (!name) {
      throw new Error("name is missing");
    }
    const updatedClassFile = await classFileModel.update(
      { name },
      {
        where: {
          id: classFileId,
          uploadedBy: req.userId,
        },
      }
    );

    return res.status(200).json(successResponseModel("classFile updated successfully", { updatedClassFile }));
  } catch (error) {
    console.log(error);
    res.status(404).json(failureResponseModel("classFile updation failed", { message: error }));
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { classFileId } = req.body;

    if (!classFileId) {
      throw new Error("classFileId is missing");
    }

    const filePath = await db.transaction(async (t) => {
      const filePathReturnData = await classFileModel.findAll(
        {
          attributes: ["filePath"],
          where: { classroomId: classFileId },
        },
        { transaction: t }
      );

      await classFileModel.destroy(
        {
          where: {
            id: classFileId,
            uploadedBy: req.userId,
          },
        },
        { transaction: t }
      );

      return filePathReturnData;
    });

    if (filePath?.length > 0) {
      for (const path of filePath) {
        fs.unlink(path?.dataValues?.filePath, (err) => {
          if (err) {
            console.error("Error removing file:", err);
            return;
          }
          console.log("File removed successfully");
        });
      }
    }

    return res.status(200).json(successResponseModel("classFile deleted successfully", { classFileId }));
  } catch (error) {
    console.log(error);
    res.status(404).json(failureResponseModel("classFile deletion failed", { message: error }));
  }
};

export const uploadClassFile = async (req) => {
  const data = fileUpload.single("file");

  return new Promise((resolve, reject) => {
    data(req, null, (err) => {
      try {
        if (err) {
          console.log(err);
          reject("Error uploading file");
        } else if (err) {
          reject("Server error");
        }

        if (!req.file) {
          reject("No file uploaded");
        }

        const filePath = req.file.path;
        resolve(filePath);
      } catch (error) {
        reject(error);
      }
    });
  });
};
