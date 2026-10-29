// apps/server/src/middleware/auth.ts (v2 — replaces the one from the last patch)
//
// CHANGE from the previous version: license is now looked up fresh from
// LicenseService on every request instead of being trusted from the JWT
// payload. Reasoning: if a school's org gets upgraded/downgraded or their
// license expires, a user's existing JWT (issued before that change)
// would otherwise keep granting the old tier's features until it expires
// naturally — potentially hours or days of stale access.

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { LicenseService } from '../services/LicenseService';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

interface TokenPayload {
  id: string;
  email: string;
  orgId?: string;
  role: 'student' | 'teacher' | 'admin';
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = header.slice('Bearer '.length);

  let payload: TokenPayload;
  try {
    payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  try {
    const license = await LicenseService.getLicenseForUser(payload.id);
    req.user = {
      id: payload.id,
      email: payload.email,
      orgId: payload.orgId,
      role: payload.role,
      license,
    };
    next();
  } catch (err) {
    console.error('[auth] failed to resolve license', err);
    return res.status(500).json({ error: 'Failed to resolve user license' });
  }
};
