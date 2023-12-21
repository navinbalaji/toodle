import { failureResponseModel, successResponseModel } from "../common.js";
import { studentModel } from "../model/studentModel.js";

export const createStudent = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new Error("name is missing");
    }

    const studentData = await studentModel.create({ name });

    return res.status(200).json(successResponseModel("student created successfully", { studentData }));
  } catch (error) {
    console.log(error);
    res.status(404).json(failureResponseModel("student creation failed", { message: error }));
  }
};
