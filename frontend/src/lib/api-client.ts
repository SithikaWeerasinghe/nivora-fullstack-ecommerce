import type { ValidationErrors } from "@/types";
import { clearAuthToken, getAuthToken } from "./auth-token";
import { ApiRequestError } from "./api-error";

/**
 * The single seam between the frontend and the Laravel REST API. Every
 * real service function goes through apiRequest() so token attachment,
 * 401/422 handling, and error shaping happen in exactly one place.
 */

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api"
).replace(/\/+$/, "");

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Attach the Sanctum bearer token — set for endpoints behind auth:sanctum. */
  auth?: boolean;
}

interface ErrorBodyShape {
  message?: string;
  errors?: ValidationErrors;
}

async function parseJsonBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = false } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiRequestError(
      "Unable to reach the server. Please check your connection and try again.",
    );
  }

  const data = (await parseJsonBody(response)) as ErrorBodyShape | null;

  if (response.status === 401) {
    clearAuthToken();
    throw new ApiRequestError(
      data?.message ?? "Your session has expired. Please log in again.",
      undefined,
      401,
    );
  }

  if (response.status === 422) {
    throw new ApiRequestError(
      data?.message ?? "The given data was invalid.",
      data?.errors,
      422,
    );
  }

  if (!response.ok) {
    throw new ApiRequestError(
      data?.message ?? "Something went wrong. Please try again.",
      undefined,
      response.status,
    );
  }

  return data as T;
}
