import { seedUsers, type MockUserRecord } from "@/data/mock-users";
import { ApiRequestError } from "@/lib/api-error";
import { STORAGE_KEYS } from "@/lib/constants";
import { mockDelay } from "@/lib/delay";
import type { LoginInput, RegisterInput, User } from "@/types";
import { readJson, removeKey, writeJson } from "./storage";

/**
 * Temporary mock authentication. The public functions mirror the future
 * Sanctum endpoints (register, login, current user, logout) so this file
 * can be replaced by real API calls without touching the auth provider.
 */

interface AuthSession {
  user: User;
  token: string;
}

function loadUsers(): MockUserRecord[] {
  const stored = readJson<MockUserRecord[]>(STORAGE_KEYS.users, []);
  return stored.length > 0 ? stored : [...seedUsers];
}

function toPublicUser(record: MockUserRecord): User {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    role: record.role,
  };
}

function createSession(record: MockUserRecord): AuthSession {
  const session: AuthSession = {
    user: toPublicUser(record),
    token: `mock-token-${record.id}-${Date.now()}`,
  };
  writeJson(STORAGE_KEYS.auth, session);
  return session;
}

/** Synchronous session read used internally by the checkout service. */
export function readSession(): AuthSession | null {
  return readJson<AuthSession | null>(STORAGE_KEYS.auth, null);
}

export async function login(input: LoginInput): Promise<User> {
  await mockDelay(550);
  const email = input.email.trim().toLowerCase();
  const match = loadUsers().find(
    (user) => user.email.toLowerCase() === email && user.password === input.password,
  );
  if (!match) {
    throw new ApiRequestError(
      "These credentials do not match our records.",
    );
  }
  return createSession(match).user;
}

export async function register(input: RegisterInput): Promise<User> {
  await mockDelay(600);
  const users = loadUsers();
  const email = input.email.trim().toLowerCase();
  if (users.some((user) => user.email.toLowerCase() === email)) {
    throw new ApiRequestError("The email has already been taken.", {
      email: ["The email has already been taken."],
    });
  }
  const record: MockUserRecord = {
    id: Date.now(),
    name: input.name.trim(),
    email: input.email.trim(),
    role: "customer",
    password: input.password,
  };
  writeJson(STORAGE_KEYS.users, [...users, record]);
  return createSession(record).user;
}

export async function getCurrentUser(): Promise<User | null> {
  await mockDelay(150);
  return readSession()?.user ?? null;
}

export async function logout(): Promise<void> {
  await mockDelay(200);
  removeKey(STORAGE_KEYS.auth);
}
