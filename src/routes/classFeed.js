import { Router } from "express";
import { getAllClasses, getAllClassesFiles, fileSearch } from "../controller/classFeed.js";

const router = Router();

/**
 * class
 */

router.get("/classes", getAllClasses);
router.get("/files/:classroomId", getAllClassesFiles);
router.post("/files/search", fileSearch);
export default router;
