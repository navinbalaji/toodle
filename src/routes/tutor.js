import { Router } from "express";
import {
  addClassroom,
  updateClassroom,
  deleteClassroom,
  uploadFile,
  updateFileName,
  deleteFile,
  createTutor,
} from "../controller/tutor.js";
import { TUTOR } from "../constants.js";
import { failureResponseModel } from "../common.js";

const router = Router();

/**
 *  tutor middleware
 */

router.use("/", (req, res, next) => {
  if (req.role === TUTOR) {
    next();
  } else {
    return res.status(400).json(failureResponseModel("you are not allowed to do this operation"));
  }
});
/**
 * classroom
 */

router.post("/classroom", addClassroom);
router.put("/classroom", updateClassroom);
router.delete("/classroom", deleteClassroom);

/**
 * file
 */

router.post("/file", uploadFile);
router.put("/file", updateFileName);
router.delete("/file", deleteFile);

router.post("/", createTutor);

export default router;
