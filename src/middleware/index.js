import jwt from "jsonwebtoken";
import { failureResponseModel } from "../common.js";

const secretKey = process.env.JWT_SECRET_KEY;

export const middlewareFunction = (req, res, next) => {
  const authorization = req.headers["authorization"];
  let token = authorization?.split(" ");

  if (!token || !token.length === 0) {
    return res.status(401).json(failureResponseModel("Unauthorized"));
  }
  token = token[1];

  if (!secretKey) {
    return res.status(401).json(failureResponseModel("Secret key is not configured"));
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(403).json(failureResponseModel("Token is not valid"));
    }
    req.user = decoded;
    req.userId = decoded.username;
    req.role = decoded.role;
    next();
  });
};
