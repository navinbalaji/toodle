import express from "express";
import "dotenv/config";
import morgan from "morgan";

const app = express();

app.use(express.json());

app.use("/files", express.static("files"));

app.use(morgan("dev"));
app.get("/ping", (req, res) => res.status(200).json({ message: "pong" }));

/**
 * Signin imports
 */
import authRouter from "./src/routes/authentication.js";
app.use("/auth", authRouter);

/**
 * middleware
 */

import { middlewareFunction } from "./src/middleware/index.js";
app.use(middlewareFunction);

/**
 * Route imports
 */
import studentRouter from "./src/routes/student.js";
import tutorRouter from "./src/routes/tutor.js";
import classRouter from "./src/routes/classFeed.js";

app.use("/student", studentRouter);
app.use("/tutor", tutorRouter);
app.use("/class", classRouter);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => console.log(`Server is running on PORT : ${PORT}`));
