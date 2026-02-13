import { Prisma } from "../../lib/prisma";
import { DbErrorCode, PRISMA_TO_DB_ERROR_MAP, PrismaErrorCode } from "../types";

export const MapPrismaError = (error: unknown): DbErrorCode | null => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return PRISMA_TO_DB_ERROR_MAP[error.code as PrismaErrorCode] ?? null;
  }
  return null;
};
