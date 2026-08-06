/**
 * Mock auth utilities for MVP.
 * Session stored in localStorage (client-side) and via cookies (server-side).
 */

import { UserProfile } from "@/types";

const SESSION_KEY = "lipafast_session";

export function setSession(user: UserProfile): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
}

export function getSession(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}
