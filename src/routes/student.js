import { Router } from "express";
import { createStudent } from "../controller/student.js";

const router = Router();

/**
 * class
 */

router.post("/", createStudent);
export default router;
