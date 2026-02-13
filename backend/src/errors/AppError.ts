import { ERROR_MAP, ErrorCode } from "./types";

export class AppError extends Error {
  public code: ErrorCode;
  public status: number;
  public details?: unknown;

  constructor(code: ErrorCode, details?: unknown) {
    super(ERROR_MAP[code].message);

    this.code = code;
    this.status = ERROR_MAP[code].status;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}
