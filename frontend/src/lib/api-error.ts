import type { ApiErrorBody, ValidationErrors } from "@/types";

/**
 * Error type thrown by the service layer. Mirrors the Laravel error body
 * (message + optional validation error bag) so the real API client can
 * throw the same shape later.
 */
export class ApiRequestError extends Error implements ApiErrorBody {
  readonly errors?: ValidationErrors;

  constructor(message: string, errors?: ValidationErrors) {
    super(message);
    this.name = "ApiRequestError";
    this.errors = errors;
  }
}

export function isApiRequestError(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
