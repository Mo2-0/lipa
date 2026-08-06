/**
 * Public Global Link page for receiving payments.
 * Example: lipafast.ug/jane-crafts-a1b2
 */

import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GlobalLinkPage({ params }: PageProps) {
  const { slug } = await params;

  // TODO: Fetch user by slug from Supabase
  // For MVP, using mock data
  const user = {
    businessName: slug
      .split("-")
      .slice(0, -1)
      .join(" ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    globalLinkSlug: slug,
  };

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <div className="text-center">
        <p className="text-sm font-medium text-[var(--accent)]">LipaFast Global Link</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Send payment to {user.businessName}
        </h1>
        <p className="mt-4 text-neutral-600">
          Create an invoice and pay instantly via MTN or Airtel Mobile Money.
        </p>
      </div>

      <div className="mt-12 rounded-lg border border-neutral-200 bg-white p-8">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-900">
              Amount (USD)
            </label>
            <input
              type="number"
              placeholder="100"
              step="0.01"
              min="0"
              className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 placeholder-neutral-400 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900">
              Description
            </label>
            <textarea
              placeholder="e.g., Fabric delivery for dress order #123"
              rows={3}
              className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 placeholder-neutral-400 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900">
              Your Email
            </label>
            <input
              type="email"
              placeholder="buyer@example.com"
              className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 placeholder-neutral-400 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[var(--accent)] px-4 py-3 font-semibold text-white hover:bg-[#0a6340]"
          >
            Create Invoice & Pay
          </button>
        </form>
      </div>

      <div className="mt-12 text-center">
        <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
          Back to LipaFast
        </Link>
      </div>
    </main>
  );
}
