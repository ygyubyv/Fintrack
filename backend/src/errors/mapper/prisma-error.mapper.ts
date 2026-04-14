import { Prisma } from "../../lib/prisma";
import type { DbErrorCode, PrismaErrorCode } from "../types";
import { PRISMA_TO_DB_ERROR_MAP } from "../types";

export const MapPrismaError = (error: unknown): DbErrorCode | null => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return PRISMA_TO_DB_ERROR_MAP[error.code as PrismaErrorCode] ?? null;
  }
  return null;
};
