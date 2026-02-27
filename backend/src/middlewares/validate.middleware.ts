import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

type TValidationSchemas = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export const ValidateMiddleware =
  (schemas: TValidationSchemas) =>
  (request: Request, response: Response, next: NextFunction) => {
    try {
      if (schemas.params) {
        request.params = schemas.params.parse(
          request.params,
        ) as typeof request.params;
      }

      if (schemas.query) {
        schemas.query.parse(request.query) as typeof request.query;
      }

      if (schemas.body) {
        request.body = schemas.body.parse(request.body);
      }

      next();
    } catch (error) {
      next(
        new AppError("VALIDATION_ERROR", {
          errors: (error as any).flatten?.(),
        }),
      );
    }
  };
