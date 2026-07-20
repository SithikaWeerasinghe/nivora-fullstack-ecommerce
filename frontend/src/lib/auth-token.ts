import { STORAGE_KEYS } from "./constants";
import { readJson, removeKey, writeJson } from "./storage";

/**
 * The Sanctum bearer token is the only piece of auth state kept on the
 * client. Only the API client and auth service read or write it —
 * components go through useAuth() instead.
 */

export function getAuthToken(): string | null {
  return readJson<string | null>(STORAGE_KEYS.authToken, null);
}

export function setAuthToken(token: string): void {
  writeJson(STORAGE_KEYS.authToken, token);
}

export function clearAuthToken(): void {
  removeKey(STORAGE_KEYS.authToken);
}
