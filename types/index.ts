/**
 * Shared domain types for LipaFast MVP.
 * Expanded as KYC, invoicing, and payouts land.
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
  kycStatus: KycStatus;
  /** Unique public link slug, e.g. lipafast.ug/jane-crafts */
  globalLinkSlug?: string;
  createdAt: string;
}
