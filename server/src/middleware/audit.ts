// apps/server/src/middleware/audit.ts
//
// CHANGE: previously this only console.log'd the audit entry — nothing
// was persisted, so the "full audit logs" enterprise feature and the
// teacher dashboard's "flags unusual patterns" claim had nothing behind
// them. Now writes through AuditService to the audit_logs table.
//
// NOTE: this middleware is mounted BEFORE the route handler
// (app.use('/api/reactions', auditMiddleware) runs ahead of
// app.use('/api/reactions', reactionsRouter) in index.ts), so
// res.statusCode isn't set yet at the point this function body runs.
// Reading it immediately would always see the default 200. Instead we
// hook the 'finish' event so we log the *actual* outcome after the route
// handler has run.
//
// Deliberately fire-and-forget (.catch, not await) so a DB hiccup never
// blocks or fails the user's actual request — audit logging is best-effort
// observability, not a gate on functionality.

import { Request, Response, NextFunction } from 'express';
import { AuditService, AuditAction } from '../services/AuditService';

function hashIp(ip: string | undefined): string {
  if (!ip) return 'unknown';
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    hash = (hash << 5) - hash + ip.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(16);
}

export const auditMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST' && req.path === '/run') {
    res.on('finish', () => {
      const action: AuditAction = res.statusCode === 403 ? 'reaction_blocked' : 'reaction_attempt';

      AuditService.log({
        userId: req.user?.id ?? 'anonymous',
        orgId: req.user?.orgId,
        action,
        details: { body: req.body, statusCode: res.statusCode },
        ipHash: hashIp(req.ip),
        userAgent: req.headers['user-agent'],
      }).catch(err => {
        console.error('[audit] failed to persist entry', err);
      });
    });
  }
  next();
};
