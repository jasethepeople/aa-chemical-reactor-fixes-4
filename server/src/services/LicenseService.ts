// apps/server/src/services/LicenseService.ts
//
// Referenced by middleware/license.ts (via req.user.license) but never
// implemented. This queries the users/organizations tables from
// schema.sql and maps license_tier -> feature flags, mirroring the
// client-side LICENSES table in hooks/useLicense.ts so both sides agree
// on what each tier unlocks.

import { pool } from '../db/pool';

export type LicenseTier = 'free' | 'education' | 'pro' | 'enterprise';

export interface LicenseFeatures {
  maxCompounds: number;
  maxReactors: number;
  allowSharing: boolean;
  allowExport: boolean;
  advancedVisuals: boolean;
  cloudSaves: boolean;
}

export interface UserLicense {
  tier: LicenseTier;
  orgId?: string;
  features: LicenseFeatures;
  expiresAt?: string;
}

const TIER_FEATURES: Record<LicenseTier, LicenseFeatures> = {
  free: {
    maxCompounds: 20, maxReactors: 2,
    allowSharing: false, allowExport: false,
    advancedVisuals: false, cloudSaves: false,
  },
  education: {
    maxCompounds: 100, maxReactors: 6,
    allowSharing: true, allowExport: true,
    advancedVisuals: true, cloudSaves: true,
  },
  pro: {
    maxCompounds: 500, maxReactors: 10,
    allowSharing: true, allowExport: true,
    advancedVisuals: true, cloudSaves: true,
  },
  enterprise: {
    maxCompounds: 9999, maxReactors: 9999,
    allowSharing: true, allowExport: true,
    advancedVisuals: true, cloudSaves: true,
  },
};

const FREE_LICENSE: UserLicense = { tier: 'free', features: TIER_FEATURES.free };

export class LicenseService {
  /**
   * Look up the license for a user. If the user belongs to an org, the
   * org's tier and expiry govern. Otherwise falls back to free.
   * An expired org license silently downgrades to free rather than
   * throwing — callers just get reduced features, not a hard failure.
   */
  static async getLicenseForUser(userId: string): Promise<UserLicense> {
    const { rows } = await pool.query<{
      org_id: string | null;
      license_tier: LicenseTier | null;
      license_expires_at: Date | null;
    }>(
      `SELECT u.org_id, o.license_tier, o.license_expires_at
       FROM users u
       LEFT JOIN organizations o ON o.id = u.org_id
       WHERE u.id = $1`,
      [userId]
    );

    if (rows.length === 0) {
      throw new Error(`No user found with id ${userId}`);
    }

    const row = rows[0];

    if (!row.org_id || !row.license_tier) {
      return FREE_LICENSE;
    }

    const expired = row.license_expires_at !== null && row.license_expires_at < new Date();
    if (expired) {
      return FREE_LICENSE;
    }

    return {
      tier: row.license_tier,
      orgId: row.org_id,
      features: TIER_FEATURES[row.license_tier],
      expiresAt: row.license_expires_at?.toISOString(),
    };
  }

  /** Convenience check used by middleware/license.ts */
  static hasFeature(license: UserLicense, feature: keyof LicenseFeatures): boolean {
    return Boolean(license.features[feature]);
  }
}
