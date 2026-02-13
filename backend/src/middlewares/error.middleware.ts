import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const ErrorMiddleware = (
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (error instanceof AppError) {
    return response.status(error.status).json({
      code: error.code,
      message: error.message,
      details: error.details,
    });
  }

  console.error(error);

  return response.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong",
  });
};
