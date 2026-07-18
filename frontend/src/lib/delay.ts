/**
 * Simulates a short network delay so loading states are visible during
 * the mock phase. Skipped on the server so prerendering stays fast.
 */
export function mockDelay(ms = 350): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}
