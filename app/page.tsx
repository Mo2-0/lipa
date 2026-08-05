import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-[var(--accent)]">
        LipaFast
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">
        Get paid globally. Settle locally.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-neutral-600">
        Invoice in USD/EUR, receive instant UGX to MTN or Airtel Mobile Money —
        with KYC and tax paperwork handled for you.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/register"
          className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0a6340]"
        >
          Register & verify KYC
        </Link>
      </div>
    </main>
  );
}
