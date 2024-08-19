import jsonwebtoken, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { StatusCode } from "../src/enums/statusEnum";
import { JWT_HASH } from "../constant";

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
  rank?: string | JwtPayload;
}

export const isAuthenticated = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res
      .status(StatusCode.Unauthorized)
      .json({ message: "Unauthenticated, please provide a valid token" });
  }

  try {
    //@ts-ignore
    const decodedToken = jsonwebtoken.verify(token, JWT_HASH);
    req.user = decodedToken;
    req.rank = decodedToken;

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(StatusCode.Unauthorized)
        .json({ message: "Token expired, please log in again" });
    } else if (err.name === "JsonWebTokenError") {
      return res
        .status(StatusCode.Unauthorized)
        .json({ message: "Invalid token, please provide a valid token" });
    } else {
      return res
        .status(StatusCode.Unauthorized)
        .json({ message: "Unauthorized access" });
    }
  }
};
