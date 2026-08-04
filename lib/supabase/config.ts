/**
 * Supabase client stubs.
 * Real clients will be wired in Phase 1 KYC once env keys are set.
 * Falls back to mock mode when NEXT_PUBLIC_SUPABASE_URL is missing/placeholder.
 */

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      key &&
      !url.includes("your-project") &&
      !key.includes("your-supabase")
  );
}

export function useMockApis(): boolean {
  return (
    process.env.USE_MOCK_APIS === "true" || !isSupabaseConfigured()
  );
}
