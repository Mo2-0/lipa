import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { useMockApis } from "@/lib/supabase/config";
import { findByEmail, saveUser } from "@/lib/kyc/store";
import { slugifyBusinessName, verifyIdentity } from "@/lib/kyc/verify";
import type {
  MobileNetwork,
  RegisterKycPayload,
  RegisterKycResponse,
  UserProfile,
} from "@/types";

const NETWORKS: MobileNetwork[] = ["MTN", "AIRTEL"];

function validatePayload(body: unknown): { ok: true; data: RegisterKycPayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid JSON body." };
  }

  const b = body as Record<string, unknown>;
  const fullName = String(b.fullName ?? "").trim();
  const email = String(b.email ?? "").trim().toLowerCase();
  const phoneNumber = String(b.phoneNumber ?? "").trim();
  const mobileNetwork = String(b.mobileNetwork ?? "").toUpperCase() as MobileNetwork;
  const nationalId = String(b.nationalId ?? "").trim();
  const businessName = String(b.businessName ?? "").trim();
  const idDocumentName = String(b.idDocumentName ?? "").trim();

  if (!fullName || fullName.length < 2) {
    return { ok: false, error: "Full name is required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Valid email is required." };
  }
  // Uganda: 256XXXXXXXXX or 07XXXXXXXX
  const phone = phoneNumber.replace(/[\s-]/g, "");
  if (!/^(?:\+?256|0)?7\d{8}$/.test(phone)) {
    return {
      ok: false,
      error: "Phone must be a Ugandan mobile number (e.g. 0772123456).",
    };
  }
  if (!NETWORKS.includes(mobileNetwork)) {
    return { ok: false, error: "Mobile network must be MTN or AIRTEL." };
  }
  if (!nationalId) {
    return { ok: false, error: "National ID (NIN) is required." };
  }
  if (!businessName || businessName.length < 2) {
    return { ok: false, error: "Business / shop name is required for your Global Link." };
  }
  if (!idDocumentName) {
    return { ok: false, error: "Please select a National ID document image." };
  }

  return {
    ok: true,
    data: {
      fullName,
      email,
      phoneNumber: normalizeUgPhone(phone),
      mobileNetwork,
      nationalId: nationalId.replace(/\s+/g, "").toUpperCase(),
      businessName,
      idDocumentName,
    },
  };
}

function normalizeUgPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("256")) return `+${digits}`;
  if (digits.startsWith("0")) return `+256${digits.slice(1)}`;
  return `+256${digits}`;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    const res: RegisterKycResponse = { success: false, mock: true, error: "Invalid JSON." };
    return NextResponse.json(res, { status: 400 });
  }

  const parsed = validatePayload(body);
  if (!parsed.ok) {
    const res: RegisterKycResponse = { success: false, mock: true, error: parsed.error };
    return NextResponse.json(res, { status: 400 });
  }

  const data = parsed.data;
  const mock = useMockApis();

  // Duplicate check (mock store; Supabase unique constraint later)
  if (findByEmail(data.email)) {
    const res: RegisterKycResponse = {
      success: false,
      mock,
      error: "An account with this email already exists.",
    };
    return NextResponse.json(res, { status: 409 });
  }

  const kyc = await verifyIdentity({
    fullName: data.fullName,
    nationalId: data.nationalId,
    idDocumentName: data.idDocumentName,
  });

  const slugBase = slugifyBusinessName(data.businessName) || "exporter";
  const slug =
    kyc.status === "verified"
      ? `${slugBase}-${Math.random().toString(36).slice(2, 6)}`
      : undefined;

  const user: UserProfile = {
    id: randomUUID(),
    email: data.email,
    fullName: data.fullName,
    phoneNumber: data.phoneNumber,
    mobileNetwork: data.mobileNetwork,
    nationalId: data.nationalId,
    idDocumentRef: data.idDocumentName,
    kycStatus: kyc.status,
    kycMessage: kyc.message,
    globalLinkSlug: slug,
    createdAt: new Date().toISOString(),
  };

  // Persist: mock store now; Supabase insert when configured
  if (mock) {
    saveUser(user);
  } else {
    // TODO: insert into Supabase `profiles` table
    saveUser(user);
  }

  const res: RegisterKycResponse = {
    success: kyc.status !== "rejected",
    mock,
    user,
    error: kyc.status === "rejected" ? kyc.message : undefined,
  };

  return NextResponse.json(res, {
    status: kyc.status === "rejected" ? 422 : 201,
  });
}
