"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import type { MobileNetwork, RegisterKycResponse, UserProfile } from "@/types";
import { setSession } from "@/lib/auth";

const initialForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
  mobileNetwork: "MTN" as MobileNetwork,
  nationalId: "",
  businessName: "",
  idDocumentName: "",
};

export function KycRegistrationForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [fileLabel, setFileLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  function update<K extends keyof typeof initialForm>(
    key: K,
    value: (typeof initialForm)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setFileLabel("");
      update("idDocumentName", "");
      return;
    }
    setFileLabel(file.name);
    update("idDocumentName", file.name);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/kyc/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as RegisterKycResponse;

      if (!data.success || !data.user) {
        setError(data.error ?? "Registration failed.");
        if (data.user?.kycStatus === "rejected") {
          setUser(data.user);
        }
        return;
      }

      setSession(data.user);
      setUser(data.user);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (user?.kycStatus === "verified") {
    const link = `lipafast.ug/${user.globalLinkSlug}`;
    return (
      <div className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent-muted)] p-8">
        <p className="text-sm font-medium text-[var(--accent)]">KYC verified</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Welcome, {user.fullName}
        </h2>
        <p className="mt-3 text-neutral-700">{user.kycMessage}</p>
        <div className="mt-6">
          <p className="text-sm text-neutral-500">Your Global Link</p>
          <p className="mt-1 font-mono text-lg text-[var(--accent)]">{link}</p>
        </div>
        <dl className="mt-6 grid gap-3 text-sm text-neutral-600 sm:grid-cols-2">
          <div>
            <dt className="text-neutral-500">Payout phone</dt>
            <dd className="font-medium text-neutral-900">
              {user.phoneNumber} ({user.mobileNetwork})
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Status</dt>
            <dd className="font-medium text-neutral-900">{user.kycStatus}</dd>
          </div>
        </dl>
        <button
          type="button"
          className="mt-8 text-sm font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          onClick={() => {
            setUser(null);
            setForm(initialForm);
            setFileLabel("");
          }}
        >
          Register another account
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Field label="Full name" htmlFor="fullName">
        <input
          id="fullName"
          name="fullName"
          required
          autoComplete="name"
          className={inputClass}
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          placeholder="Jane Nakato"
        />
      </Field>

      <Field label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="jane@crafts.ug"
        />
      </Field>

      <Field label="Business / shop name" htmlFor="businessName">
        <input
          id="businessName"
          name="businessName"
          required
          className={inputClass}
          value={form.businessName}
          onChange={(e) => update("businessName", e.target.value)}
          placeholder="Jane Crafts"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Used for your unique lipafast.ug link
        </p>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Mobile money number" htmlFor="phoneNumber">
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            required
            autoComplete="tel"
            className={inputClass}
            value={form.phoneNumber}
            onChange={(e) => update("phoneNumber", e.target.value)}
            placeholder="0772123456"
          />
        </Field>

        <Field label="Network" htmlFor="mobileNetwork">
          <select
            id="mobileNetwork"
            name="mobileNetwork"
            className={inputClass}
            value={form.mobileNetwork}
            onChange={(e) =>
              update("mobileNetwork", e.target.value as MobileNetwork)
            }
          >
            <option value="MTN">MTN</option>
            <option value="AIRTEL">Airtel</option>
          </select>
        </Field>
      </div>

      <Field label="National ID (NIN)" htmlFor="nationalId">
        <input
          id="nationalId"
          name="nationalId"
          required
          className={inputClass}
          value={form.nationalId}
          onChange={(e) => update("nationalId", e.target.value)}
          placeholder="CM900121001ABC"
          maxLength={14}
        />
        <p className="mt-1 text-xs text-neutral-500">
          14 characters. Demo: IDs ending in 0 are rejected by mock KYC.
        </p>
      </Field>

      <Field label="National ID document" htmlFor="idDocument">
        <input
          id="idDocument"
          name="idDocument"
          type="file"
          accept="image/*,.pdf"
          required
          className="block w-full text-sm text-neutral-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--accent-muted)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--accent)]"
          onChange={onFileChange}
        />
        {fileLabel ? (
          <p className="mt-1 text-xs text-neutral-500">Selected: {fileLabel}</p>
        ) : null}
      </Field>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0a6340] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Verifying KYC…" : "Register & verify KYC"}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-neutral-800"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none ring-[var(--accent)] placeholder:text-neutral-400 focus:ring-2";
