/**
 * Shared domain types for LipaFast MVP.
 */

export type KycStatus = "pending" | "verified" | "rejected" | "not_started";

export type MobileNetwork = "MTN" | "AIRTEL";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  mobileNetwork: MobileNetwork;
  nationalId?: string;
  /** Filename or mock reference for uploaded National ID image */
  idDocumentRef?: string;
  kycStatus: KycStatus;
  kycMessage?: string;
  /** Unique public link slug, e.g. lipafast.ug/jane-crafts */
  globalLinkSlug?: string;
  createdAt: string;
}

export interface RegisterKycPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  mobileNetwork: MobileNetwork;
  nationalId: string;
  /** Business / shop name used for the Global Link slug */
  businessName: string;
  /** Client sends filename only; real upload lands in a later step */
  idDocumentName: string;
}

export interface RegisterKycResponse {
  success: boolean;
  mock: boolean;
  user?: UserProfile;
  error?: string;
}
