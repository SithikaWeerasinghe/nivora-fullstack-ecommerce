import { apiRequest } from "@/lib/api-client";
import { clearAuthToken, getAuthToken, setAuthToken } from "@/lib/auth-token";
import type { LoginInput, RegisterInput, User } from "@/types";

interface AuthResponse {
  user: User;
  token: string;
}

/** `POST /api/login`. */
export async function login(input: LoginInput): Promise<User> {
  const { user, token } = await apiRequest<AuthResponse>("/login", {
    method: "POST",
    body: input,
  });
  setAuthToken(token);
  return user;
}

/** `POST /api/register`. */
export async function register(input: RegisterInput): Promise<User> {
  const { user, token } = await apiRequest<AuthResponse>("/register", {
    method: "POST",
    body: input,
  });
  setAuthToken(token);
  return user;
}

/** `GET /api/user`. Resolves null when signed out or the token is invalid. */
export async function getCurrentUser(): Promise<User | null> {
  if (!getAuthToken()) return null;
  try {
    return await apiRequest<User>("/user", { auth: true });
  } catch {
    return null;
  }
}

/** `POST /api/logout`. The local token is cleared regardless of the server outcome. */
export async function logout(): Promise<void> {
  if (getAuthToken()) {
    try {
      await apiRequest<{ message: string }>("/logout", {
        method: "POST",
        auth: true,
      });
    } catch {
      // Token is cleared below either way — a failed logout call shouldn't
      // leave the user stuck signed in on the client.
    }
  }
  clearAuthToken();
}
