// apps/server/src/services/AuditService.ts
//
// Referenced by middleware/audit.ts (which just console.logged before) and
// needed for the "teacher dashboard shows class activity and flags unusual
// patterns" feature mentioned in the SaaS strategy. Writes to the
// audit_logs table from schema.sql.

import { pool } from '../db/pool';

export type AuditAction = 'reaction_attempt' | 'reaction_blocked' | 'recipe_save' | 'recipe_share';

export interface AuditEntryInput {
  userId: string;
  orgId?: string;
  action: AuditAction;
  details: Record<string, unknown>;
  ipHash?: string;
  userAgent?: string;
}

export interface AuditEntry extends AuditEntryInput {
  id: string;
  createdAt: string;
}

export class AuditService {
  /**
   * Fire-and-forget from the caller's perspective (middleware/audit.ts
   * should not await this on the hot path), but this method itself does
   * a real insert and can throw — callers that care about durability
   * should await + catch; callers that don't can call .catch(() => {}).
   */
  static async log(entry: AuditEntryInput): Promise<void> {
    await pool.query(
      `INSERT INTO audit_logs (user_id, org_id, action, details, ip_hash, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        entry.userId,
        entry.orgId ?? null,
        entry.action,
        JSON.stringify(entry.details),
        entry.ipHash ?? null,
        entry.userAgent ?? null,
      ]
    );
  }

  /** For a teacher/admin dashboard: recent activity for one org. */
  static async getRecentForOrg(orgId: string, limit = 100): Promise<AuditEntry[]> {
    const { rows } = await pool.query(
      `SELECT id, user_id, org_id, action, details, ip_hash, user_agent, created_at
       FROM audit_logs
       WHERE org_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [orgId, limit]
    );

    return rows.map(r => ({
      id: r.id,
      userId: r.user_id,
      orgId: r.org_id,
      action: r.action,
      details: r.details,
      ipHash: r.ip_hash,
      userAgent: r.user_agent,
      createdAt: r.created_at.toISOString(),
    }));
  }

  /**
   * Simple anomaly flag for the "flags unusual patterns" claim in the
   * SaaS pitch: more than `threshold` blocked reactions from one user in
   * the last hour. Extend with real heuristics as needed — this is a
   * starting point, not a full detection system.
   */
  static async getUsersWithExcessiveBlocks(orgId: string, threshold = 5): Promise<string[]> {
    const { rows } = await pool.query<{ user_id: string }>(
      `SELECT user_id
       FROM audit_logs
       WHERE org_id = $1
         AND action = 'reaction_blocked'
         AND created_at > NOW() - INTERVAL '1 hour'
       GROUP BY user_id
       HAVING COUNT(*) >= $2`,
      [orgId, threshold]
    );
    return rows.map(r => r.user_id);
  }
}
