import type { User } from "@/types";

/**
 * Seed accounts for the mock auth service. Assessment-only demo data —
 * replaced by Laravel Sanctum authentication in the integration phase.
 */
export interface MockUserRecord extends User {
  password: string;
}

export const seedUsers: MockUserRecord[] = [
  {
    id: 1,
    name: "Demo Customer",
    email: "customer@nivora.test",
    role: "customer",
    password: "password",
  },
];
