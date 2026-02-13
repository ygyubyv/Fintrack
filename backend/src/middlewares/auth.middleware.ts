import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_CONFIG } from "../config";

const { accessTokenSecret } = JWT_CONFIG;

export const AuthMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(401).json({
      message: "Access token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, accessTokenSecret!) as JwtPayload;

    request.user = {
      id: decoded.sub!,
    };

    next();
  } catch (error) {
    console.error(error);
    return response.status(401).json({
      message: "Access token invalid or expired",
    });
  }
};
