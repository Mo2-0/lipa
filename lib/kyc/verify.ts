import type { KycStatus } from "@/types";

export interface KycVerifyInput {
  fullName: string;
  nationalId: string;
  idDocumentName: string;
}

export interface KycVerifyResult {
  status: KycStatus;
  message: string;
  provider: "mock" | "smile" | "veriff" | "onfido";
}

/**
 * Mock KYC provider (Smile Identity / Veriff shaped).
 * Rules for demo:
 * - National ID must be 14 alphanumeric chars (Ugandan NIN-style length)
 * - IDs ending in "0" are rejected
 * - Missing document name → pending
 */
export async function verifyIdentity(
  input: KycVerifyInput
): Promise<KycVerifyResult> {
  const providerEnv = process.env.KYC_PROVIDER ?? "mock";
  const hasRealKey = Boolean(process.env.KYC_API_KEY);

  // Real provider hook — not wired until keys exist
  if (providerEnv !== "mock" && hasRealKey) {
    // TODO: call Smile Identity / Veriff API
    return {
      status: "pending",
      message: "Submitted to KYC provider; awaiting webhook.",
      provider: providerEnv as KycVerifyResult["provider"],
    };
  }

  await delay(400);

  const nin = input.nationalId.replace(/\s+/g, "").toUpperCase();

  if (!input.idDocumentName?.trim()) {
    return {
      status: "pending",
      message: "ID document required before verification can complete.",
      provider: "mock",
    };
  }

  if (!/^[A-Z0-9]{14}$/.test(nin)) {
    return {
      status: "rejected",
      message:
        "National ID must be 14 characters (letters/numbers). Example: CM900121001ABC",
      provider: "mock",
    };
  }

  if (nin.endsWith("0")) {
    return {
      status: "rejected",
      message: "Mock KYC rejected this ID. Try an ID that does not end in 0.",
      provider: "mock",
    };
  }

  return {
    status: "verified",
    message: `Mock KYC verified ${input.fullName}. Ready for Global Link.`,
    provider: "mock",
  };
}

export function slugifyBusinessName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
