import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { AUTH_CONFIG } from "../config/auth.config";

const { accessTokenSecret } = AUTH_CONFIG;

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
      id: Number(decoded.sub!),
    };

    next();
  } catch (error) {
    console.error(error);
    return response.status(401).json({
      message: "Access token invalid or expired",
    });
  }
};
