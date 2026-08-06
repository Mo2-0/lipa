"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { UserProfile } from "@/types";
import { getSession, clearSession } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/register");
      return;
    }
    setUser(session);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
        <p className="text-neutral-600">Loading...</p>
      </main>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm font-medium text-[var(--accent)]">
          ← LipaFast
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm text-neutral-600 hover:text-neutral-900"
        >
          Logout
        </button>
      </div>

      <div className="mt-12">
        <h1 className="text-3xl font-semibold">Welcome, {user.fullName}!</h1>
        <p className="mt-2 text-neutral-600">
          Your KYC status: <span className="font-medium capitalize">{user.kycStatus}</span>
        </p>
      </div>

      {user.kycStatus === "verified" && user.globalLinkSlug && (
        <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6">
          <h2 className="font-semibold text-green-900">✓ Account Verified</h2>
          <p className="mt-2 text-sm text-green-700">
            Your Global Link is ready! Share this unique link to receive payments:
          </p>
          <div className="mt-4 flex items-center gap-2">
            <code className="flex-1 rounded bg-white px-3 py-2 font-mono text-sm">
              lipafast.ug/{user.globalLinkSlug}
            </code>
            <button
              onClick={() => {
                const link = `https://lipafast.ug/${user.globalLinkSlug}`;
                navigator.clipboard.writeText(link);
              }}
              className="text-sm font-medium text-green-700 hover:underline"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {user.kycStatus === "pending" && (
        <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <h2 className="font-semibold text-yellow-900">⏳ Verification in Progress</h2>
          <p className="mt-2 text-sm text-yellow-700">
            Your National ID is being verified. This usually takes 24-48 hours.
          </p>
        </div>
      )}

      {user.kycStatus === "rejected" && (
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">✗ Verification Failed</h2>
          <p className="mt-2 text-sm text-red-700">
            {user.kycMessage || "Your KYC verification was rejected."}
          </p>
          <Link
            href="/register"
            className="mt-4 inline-block text-sm font-medium text-red-700 hover:underline"
          >
            Try again →
          </Link>
        </div>
      )}

      <div className="mt-12 grid gap-6">
        <div className="rounded-lg border border-neutral-200 p-6">
          <h3 className="font-semibold">Account Details</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Email:</span>
              <span className="font-mono">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Phone:</span>
              <span className="font-mono">{user.phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Mobile Network:</span>
              <span>{user.mobileNetwork}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
