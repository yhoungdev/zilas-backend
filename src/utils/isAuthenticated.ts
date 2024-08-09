import jsonwebtoken from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { StatusCode } from "../enums/statusEnum";
import { JWT_HASH } from "../constant";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token)
    return res
      .status(StatusCode.Unauthorized)
      .json({ message: "Invalid token" });

  try {
    //@ts-ignore
    const decodedToken = jsonwebtoken.verify(token, JWT_HASH);
    req.user = decodedToken;
    next();
  } catch (err) {
    res.status(StatusCode.Unauthorized).json({ message: "Invalid token" });
  }
};
