import type { UserProfile } from "@/types";

/**
 * In-memory store for MVP when Supabase keys are missing.
 * Reset on server restart — swap for Supabase in production.
 */

const users = new Map<string, UserProfile>();

export function saveUser(user: UserProfile): UserProfile {
  users.set(user.id, user);
  users.set(user.email.toLowerCase(), user);
  if (user.globalLinkSlug) {
    users.set(`slug:${user.globalLinkSlug}`, user);
  }
  return user;
}

export function findByEmail(email: string): UserProfile | undefined {
  return users.get(email.toLowerCase());
}

export function findBySlug(slug: string): UserProfile | undefined {
  return users.get(`slug:${slug}`);
}

export function listUsers(): UserProfile[] {
  const seen = new Set<string>();
  const result: UserProfile[] = [];
  for (const user of users.values()) {
    if (seen.has(user.id)) continue;
    seen.add(user.id);
    result.push(user);
  }
  return result;
}
