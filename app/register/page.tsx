import Link from "next/link";
import { KycRegistrationForm } from "@/components/KycRegistrationForm";

export const metadata = {
  title: "Register & KYC | LipaFast",
  description: "Create your LipaFast account and verify your National ID",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto min-h-screen max-w-lg px-6 py-12">
      <Link
        href="/"
        className="text-sm font-medium text-[var(--accent)] hover:underline"
      >
        ← LipaFast
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        Create your account
      </h1>
      <p className="mt-2 text-neutral-600">
        Scan your National ID, link MTN or Airtel Mobile Money, and get your
        Global Link.
      </p>
      <div className="mt-8">
        <KycRegistrationForm />
      </div>
    </main>
  );
}
