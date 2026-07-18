/**
 * Sanitises a post-auth redirect target: only same-app absolute paths
 * are accepted, so external or protocol-relative URLs can never be used.
 */
export function safeRedirectPath(raw: string | null): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }
  return "/";
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
