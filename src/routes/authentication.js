import { Router } from "express";
import { signInController } from "../controller/authentication.js";

const router = Router();

router.post("/signin", signInController);

export default router;
