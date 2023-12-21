import jwt from "jsonwebtoken";
import { failureResponseModel, successResponseModel } from "../common.js";
import { STUDENT, TUTOR } from "../constants.js";

const secretKey = process.env.JWT_SECRET_KEY;

export const signInController = (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new Error("Either Username or password is missing");
    }

    if (!secretKey) {
      throw new Error("Secret key is not configured");
    }

    const payload = {
      username,
      role: username === "student" ? STUDENT : TUTOR,
    };

    // Create and sign the JWT
    jwt.sign(payload, secretKey, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        res.status(500).json(failureResponseModel("Failed to generate token"));
      } else {
        res.status(200).json(successResponseModel(null, { token }));
      }
    });
  } catch (err) {
    return res.status(404).json(failureResponseModel(err.message));
  }
};
