import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const ValidateMiddleware =
  (schema: ZodSchema) =>
  (req: Request, response: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError("VALIDATION_ERROR", {
          errors: result.error.flatten(),
        }),
      );
    }

    req.body = result.data;

    next();
  };
