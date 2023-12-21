import multer from "multer";
import { nanoid } from "nanoid";

const filestorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files");
  },
  filename: (req, file, cb) => {
    cb(null, nanoid() + file.originalname);
  },
});

export const fileUpload = multer({
  storage: filestorageEngine,
});
